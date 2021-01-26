import Vue from 'vue';
import {TranslateMixin} from '../TranslateMixin';

const dialogPolyfill = require('dialog-polyfill');

export const ConfirmDialog = Vue.component('confirm-dialog', {
  props: {
    message: {
      type: String,
    },
  },
  data: function() {
    return {
      hide: false as unknown[] | boolean,
    };
  },
  mixins: [TranslateMixin],
  watch: {
    hide: function() {
      this.$emit('hide', this.hide);
    },
  },
  methods: {
    accept: function() {
      this.$emit('accept');
    },
    dismiss: function() {
      this.$emit('dismiss');
    },
    show: function() {
      (this.$refs['dialog'] as HTMLDialogElement).showModal();
    },
  },
  mounted: function() {
    dialogPolyfill.default.registerDialog(this.$refs['dialog']);
  },
  template: `<dialog ref="dialog">
      <form method="dialog">
        <p v-i18n class="newlines">{{ message }}</p>
        <menu class="dialog-menu centered-content">
          <button class="btn btn-lg btn-primary" v-on:click="accept()">Yes</button>
          <button class="btn btn-lg" v-on:click="dismiss()">No</button>
        </menu>
        <input type="checkbox" v-model="hide" id="dialog-confirm-dismiss" />
        <label for="dialog-confirm-dismiss">Don't show this again</label>
      </form>
    </dialog>`,
});

