<template>
  <button @click="$emit('click')" class="btn" :class="outerClass" :disabled="isDisabled" v-i18n>
    <span v-if="hasIcon" class="icon" :class="iconClass" data-test="icon"/>
    <span v-else>{{ buttonText }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import {vueRoot} from '@/client/components/vueRoot';
import {Message} from '@/common/logs/Message';
import {translateText, translateMessage} from '@/client/directives/i18n';

export default Vue.extend({
  name: 'AppButton',
  props: {
    title: {
      type: [String, Object as () => Message],
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      validator: (align) => ['right', 'left', 'center'].includes(align),
      required: false,
      default: 'center',
    },
    size: {
      type: String,
      default: 'normal',
      validator: (item) => ['tiny', 'small', 'normal', 'big', 'jumbo'].includes(item),
    },
    rounded: {
      type: Boolean,
      default: true,
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
  },
  computed: {
    isDisabledDueToServerBusy(): boolean {
      return this.disableOnServerBusy && vueRoot(this).isServerSideRequestInProgress;
    },
    isDisabled(): boolean {
      return this.disabled || this.isDisabledDueToServerBusy;
    },
    hasIcon(): boolean {
      const iconTypes = ['close', 'back', 'plus', 'minus'];
      return iconTypes.includes(this.type);
    },
    outerClass(): Object {
      return {
        // size
        'btn-tiny': this.size === 'tiny',
        'btn-sm': this.size === 'small',
        'btn-lg': this.size === 'big',

        // type
        'btn-max': this.type === 'max',
        'btn-plus': this.type === 'plus',
        'btn-minus': this.type === 'minus',
        'btn-success': this.type === 'success',
        'btn-error': this.type === 'error',
        'btn-action': this.type === 'action',
        'btn-submit': this.type === 'submit',

        // align
        'float-left': this.align === 'left',
        'float-right': this.align === 'right',

        'btn-rounded': this.rounded === true,

        // loading
        'loading': this.isDisabledDueToServerBusy,
      };
    },
    iconClass(): Object {
      return {
        'icon-cross': this.type === 'close',
        'icon-back': this.type === 'back',
        'icon-plus': this.type === 'plus',
        'icon-minus': this.type === 'minus',
      };
    },
    buttonText(): string {
      if (typeof this.title === 'string') {
        return translateText(this.title);
      } else if (typeof this.title === 'object') {
        return translateMessage(this.title);
      } else {
        return '';
      }
    },
  },
});
</script>
