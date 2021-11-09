<script lang="ts">
import Vue from 'vue';
import {showModal, windowHasHTMLDialogElement} from '@/client/components/HTMLDialogElementCompatibility';

const dialogPolyfill = require('dialog-polyfill');

export default Vue.extend({
  name: 'ConfirmDialog',
  props: {
    message: {
      type: String,
    },
    enableDontShowAgainCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hide: false,
    };
  },
  watch: {
    hide() {
      this.$emit('hide', this.hide);
    },
  },
  methods: {
    accept() {
      this.$emit('accept');
    },
    dismiss() {
      this.$emit('dismiss');
    },
    show() {
      showModal(this.$refs['dialog'] as HTMLElement);
    },
  },
  mounted() {
    if (!windowHasHTMLDialogElement()) dialogPolyfill.default.registerDialog(this.$refs['dialog']);
  },
});
</script>

<template>
  <dialog ref="dialog">
    <form method="dialog">
      <p v-i18n class="newlines">{{ message }}</p>
      <menu class="dialog-menu centered-content">
        <button class="btn btn-lg btn-primary" v-on:click="accept()">Yes</button>
        <button class="btn btn-lg" v-on:click="dismiss()">No</button>
      </menu>
      <input v-if="enableDontShowAgainCheckbox" type="checkbox" v-model="hide" id="dialog-confirm-dismiss" />
      <label v-if="enableDontShowAgainCheckbox" for="dialog-confirm-dismiss">Don't show this again</label>
    </form>
  </dialog>
</template>

