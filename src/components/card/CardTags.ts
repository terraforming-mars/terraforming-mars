import Vue from 'vue';
import CardTag from './CardTag.vue';

export const CardTags = Vue.component('CardTags', {
  props: {
    tags: Array,
  },
  components: {
    CardTag,
  },
  template: `
        <div class="card-tags">
            <CardTag v-for="(cardTag, index) in tags" :key="index" :index="index" :type="cardTag"/>
        </div>
    `,
});
