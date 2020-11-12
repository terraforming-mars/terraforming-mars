import Vue from 'vue';
import {GameModule} from '../../GameModule';

const MODULE_TO_CSS: Map<string, string> = new Map([
  [GameModule.CorpEra, 'corporate-icon'],
  [GameModule.Promo, 'promo-icon'],
  [GameModule.Venus, 'venus-icon'],
  [GameModule.Colonies, 'colonies-icon'],
  [GameModule.Prelude, 'prelude-icon'],
  [GameModule.Turmoil, 'turmoil-icon'],
  [GameModule.Community, 'community-icon'],
  [GameModule.Ares, 'ares-icon']],
);
export const CardExpansion = Vue.component('CardExpansion', {
  props: {
    expansion: {
      type: String,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['card-expansion', 'project-icon'];
      const expansionClass = MODULE_TO_CSS.get(this.expansion);
      if (expansionClass !== undefined) {
        classes.push(expansionClass);
      }

      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()"></div>
    `,
});
