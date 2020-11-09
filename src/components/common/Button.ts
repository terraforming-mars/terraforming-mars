import Vue from 'vue';

export const Button = Vue.component('Button', {
  props: {
    title: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      validator: (align) => ['right', 'left'].includes(align),
    },
    size: {
      type: String,
      default: 'normal',
      validator: (item) =>
        ['tiny', 'small', 'normal', 'big', 'jumbo'].includes(item),
    },
    disableOnServerBusy: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'normal',
      validator: (item) =>
        [
          'normal',
          'action',
          'max',
          'success',
          'error',
          'submit',
          'close',
          'back',
          'minus',
          'plus',
        ].includes(item),
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['btn'];

      // size
      if (this.size === 'tiny') {
        classes.push('btn-tiny');
      } else if (this.size === 'small') {
        classes.push('btn-sm');
      } else if (this.size === 'big') {
        classes.push('btn-lg');
      }
      // type
      if (this.type === 'max') {
        classes.push('btn-max'); // #TODO max_button?
      } else if (this.type === 'success') {
        classes.push('btn-success');
      } else if (this.type === 'error') {
        classes.push('btn-error'); // #TODO this is never red since .btn is always on top, needs discussion
      } else if (this.type === 'action') {
        classes.push('btn-action');
      } else if (this.type === 'submit') {
        classes.push('btn-submit');
      }

      // align
      if (this.align === 'left') {
        classes.push('float-left');
      } else if (this.align === 'right') {
        classes.push('float-right');
      }

      // disabled
      if (this.disableOnServerBusy) {
        if ((this.$root as any).isServerSideRequestInProgress) {
          classes.push('loading');
        }
      }

      return classes.join(' ');
    },
    getDisabled: function(): boolean {
      if (this.disableOnServerBusy) {
        return (
          this.disabled ||
                    (this.$root as any).isServerSideRequestInProgress
        );
      }
      return this.disabled;
    },
    getHtmlContent: function(): string {
      if (this.type === 'close') {
        return '<i class=\'icon icon-cross\' />';
      }
      if (this.type === 'back') {
        return '<i class=\'icon icon-back\' />';
      }
      if (this.type === 'plus') {
        return '<i class=\'icon icon-plus\' />';
      }
      if (this.type === 'minus') {
        return '<i class=\'icon icon-minus\' />';
      }

      return this.title;
    },
  },
  template: `
        <button v-on:click.prevent="onClick" :class="getClasses()" :disabled="getDisabled()" v-html="getHtmlContent()" v-i18n />
    `,
});
