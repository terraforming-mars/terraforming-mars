<template>
  <a class="home-link" href="." v-i18n><slot></slot></a>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

// Links back to the start screen. Wrap page titles in this so every page has a way home.
export default defineComponent({
  name: 'HomeLink',
});
</script>

<style scoped lang="less">
.home-link {
  &:link, &:visited, &:active {
    color: inherit;
    text-decoration: none;
  }

  &:hover {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
