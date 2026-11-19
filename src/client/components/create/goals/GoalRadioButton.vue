<!-- One of the milestones and awards popup's rows of radio buttons, such as the type. -->
<template>
  <div class="create-game-ma-row">
    <span class="create-game-ma-row-heading" v-i18n>{{ heading }}</span>
    <template v-for="choice in choices" :key="choice">
      <input type="radio" :name="name" :checked="selected === choice" @change="selected = choice" :id="radioId(choice)">
      <label :for="radioId(choice)" v-i18n>{{ labels[choice] }}</label>
    </template>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
const props = defineProps<{
  /** The row's title, such as "Type". Translated. */
  heading: string;
  /** The radio group's name, which also makes the radios' ids unique. */
  name: string;
  choices: ReadonlyArray<T>;
  /** Each choice's label. Translated. */
  labels: Readonly<Record<T, string>>;
}>();

/** The checked choice. Checking another emits it. */
const selected = defineModel<T>({required: true});

function radioId(choice: T): string {
  return `${props.name}-${choice}-radio`;
}
</script>

<style scoped lang="less">
.create-game-ma-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

.create-game-ma-row-heading {
  margin-right: 8px;
  font-weight: bold;
}
</style>
