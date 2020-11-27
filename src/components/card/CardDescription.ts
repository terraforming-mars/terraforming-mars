import Vue from 'vue';
import {isIDescription} from '../../cards/render/ICardRenderDescription';
import {generateClassString} from '../../utils/utils';

export const CardDescription = Vue.component('CardDescription', {
  props: {
    item: {
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: string[] = ['card-description'];
      if (isIDescription(this.item)) {
        if (this.item.align !== 'center') {
          // we want to reduce size for aligned left of right to 60%
          classes.push('card-description-aligned');
        }
        classes.push('card-description-align--' + this.item.align);
      }
      return generateClassString(classes);
    },
    getHtmlContent: function(): string {
      let result: string = '';
      if (isIDescription(this.item)) {
        result = this.item.text;
      } else {
        result = <string> this.item;
      }

      return `(${result})`;
    },
  },
  template: `
      <div :class="getClasses()" v-html="getHtmlContent()"></div>
  `,
});
