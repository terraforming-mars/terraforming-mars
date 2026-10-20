<template>
  <PopupPanel class="create-game-validation-popup" @close="$emit('close')">
    <template #header>
      <h2 v-i18n>Game Settings Validation</h2>
    </template>
    <ul class="create-game-validation-problems">
      <li v-for="problem in sortedProblems" :key="problem.key">
        <span v-if="problem.blocking" class="create-game-validation-icon" title="Error">&#x1F6D1;</span>
        <span v-else class="create-game-validation-icon" title="Warning">&#9888;&#xFE0F;</span>
        <span>{{ problem.text }}</span>
        <template v-if="problem.learnMore">&nbsp;<a :href="problem.learnMore" target="_blank" v-i18n>Learn more</a></template>
        <ul v-if="problem.items.length > 0">
          <li v-for="item in problem.items" :key="item" v-i18n>{{ item }}</li>
        </ul>
      </li>
    </ul>
  </PopupPanel>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';
import {validationDetails, ValidationErrors} from '@/common/game/validateNewGameConfig';
import {translateMessage, translateText} from '@/client/directives/i18n';
import {WIKI_URLS} from '@/client/utils/WikiLinks';
import {partition} from '@/common/utils/utils';

type Problem = {
  key: keyof ValidationErrors,
  text: string,
  items: ReadonlyArray<string>,
  learnMore: string | undefined,
  blocking: boolean,
};

// Wiki pages that explain a validation problem in more detail.
const learnMoreUrls: Partial<Record<keyof ValidationErrors, string>> = {
  maybeNotEnoughPreludes: WIKI_URLS.customPreludes,
};

const props = defineProps<{
  errors: ValidationErrors;
}>();

defineEmits<{
  'close': [];
}>();

/*
 * Returns true when this value represents the warning being engaged.
 *
 * For booleans that's 'true', for numbers that's non-zero and for arrays, that's non-empty.
 */
function isSet(value: ValidationErrors[keyof ValidationErrors]): boolean {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

const problems = computed((): Array<Problem> => {
  const result: Array<Problem> = [];
  for (const key of Object.keys(validationDetails) as Array<keyof ValidationErrors>) {
    const value = props.errors[key];
    if (!isSet(value)) {
      continue;
    }
    const {message} = validationDetails[key];
    const text = typeof message === 'string' ? translateText(message) : translateMessage(message(props.errors));
    const items = Array.isArray(value) ? value : [];
    result.push({key, text, items, learnMore: learnMoreUrls[key], blocking: validationDetails[key].blocking});
  }
  return result;
});

/** Errors first, then warnings. */
const sortedProblems = computed((): Array<Problem> => {
  const [errors, warnings] = partition(problems.value, (problem) => problem.blocking);
  return [...errors, ...warnings];
});
</script>
