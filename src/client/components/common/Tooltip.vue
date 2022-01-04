<template>
  <a :href="link" class="tooltip" target="_blank">&#9432;</a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    link: {type: String, default: ''},
  },
});
</script>
