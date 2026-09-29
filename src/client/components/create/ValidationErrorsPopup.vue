<template>
  <PopupPanel class="create-game-validation-popup" @close="$emit('close')">
    <template #header>
      <h2 v-i18n>Game Settings Validation</h2>
    </template>
    <template v-for="group in groups" :key="group.title">
      <template v-if="group.problems.length > 0">
        <h3 v-i18n>{{ group.title }}</h3>
        <ul class="create-game-validation-problems">
          <li v-for="problem in group.problems" :key="problem.key">
            <span>{{ problem.text }}</span>
            <template v-if="problem.learnMore">&nbsp;<a :href="problem.learnMore" target="_blank" v-i18n>Learn more</a></template>
            <ul v-if="problem.items.length > 0">
              <li v-for="item in problem.items" :key="item" v-i18n>{{ item }}</li>
            </ul>
          </li>
        </ul>
      </template>
    </template>
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
    result.push({key, text, items, learnMore: learnMoreUrls[key]});
  }
  return result;
});

/** Groups the validation results by warning or error. */
const groups = computed(() => {
  const [errors, warnings] = partition(problems.value, (problem) => validationDetails[problem.key].blocking);
  return [
    {title: 'Errors', problems: errors},
    {title: 'Warnings', problems: warnings},
  ];
});
</script>
