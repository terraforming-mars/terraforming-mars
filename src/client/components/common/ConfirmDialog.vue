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

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import {showModal, windowHasHTMLDialogElement} from '@/client/components/HTMLDialogElementCompatibility';

const dialogPolyfill = require('dialog-polyfill');


type Refs = {
  dialog: HTMLDialogElement;
};

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    message: {
      type: String,
      required: true,
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
  computed: {
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
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
      showModal(this.typedRefs.dialog);
    },
  },
  mounted() {
    if (!windowHasHTMLDialogElement()) dialogPolyfill.default.registerDialog(this.typedRefs.dialog);
  },
});
</script>
