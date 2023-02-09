<script lang="ts">
import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';
import {showModal, windowHasHTMLDialogElement} from '@/client/components/HTMLDialogElementCompatibility';

const dialogPolyfill = require('dialog-polyfill');

type Refs = {
  dialog: HTMLElement,
}

export default (Vue as WithRefs<Refs>).extend({
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
      shown: false,
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
      this.shown = true;
      showModal(this.$refs.dialog);
    },
  },
  mounted() {
    if (!windowHasHTMLDialogElement()) dialogPolyfill.default.registerDialog(this.$refs.dialog);
  },
});
</script>

<template>
  <dialog ref="dialog">
    <form method="dialog">
      <p v-i18n class="newlines">{{ message }}</p>
      <menu class="dialog-menu centered-content">
        <button class="btn btn-lg btn-primary" v-on:click="accept()" v-i18n>Yes</button>
        <button class="btn btn-lg" v-on:click="dismiss()" v-i18n>No</button>
      </menu>
      <template v-if="enableDontShowAgainCheckbox">
        <input type="checkbox" v-model="hide" id="dialog-confirm-dismiss" />
        <label for="dialog-confirm-dismiss" v-i18n>Don't show this again</label>
      </template>
    </form>
  </dialog>
</template>

