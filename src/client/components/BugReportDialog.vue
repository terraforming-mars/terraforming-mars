<template>
  <dialog ref="dialog" class="bug-dialog">
    <p class="center">Copy the text below and then paste it in<br>
        a <a href="https://github.com/terraforming-mars/terraforming-mars/issues/new?template=from-heroku.md" target="_blank">GitHub issue</a>
      or the <a href="https://discord.com/channels/737945098695999559/742721510376210583" target="_blank">#bug-reports Discord channel</a>
    </p>
    <textarea ref="textarea" readonly rows="5" cols = "40" v-model="message"></textarea>
    <menu class="dialog-menu centered-content">
      <div>
        <button class="btn btn-lg btn-primary" @click="copyTextArea">Copy to Clipboard</button>
        <div :class="{ center: true, invisible: !showCopied }">Copied!</div>
      </div>
      <button class="btn btn-lg btn-primary" @click="$emit('hide')">Close</button>
    </menu>
  </dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';
import {showModal, windowHasHTMLDialogElement} from '@/client/components/HTMLDialogElementCompatibility';
import {GameModel} from '@/common/models/GameModel';
import {Color} from '@/common/Color';
import * as raw_settings from '@/genfiles/settings.json';

const dialogPolyfill = require('dialog-polyfill');

type Refs = {
  dialog: HTMLElement,
  textarea: HTMLTextAreaElement,
  copied: HTMLSpanElement,
}

function spectatorUrl(model: GameModel | undefined) {
  const url = new URL(window.location.href);
  if (url.searchParams.has('id') && model?.spectatorId) {
    url.searchParams.set('id', model.spectatorId);
  }
  return url;
}

function browser(): string {
  // Taken from https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
  const ua= navigator.userAgent;
  let match = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(match[1])) {
    const temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE '+(temp[1] || '');
  }
  if (match[1]=== 'Chrome') {
    const temp = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (temp !== null) return temp.slice(1).join(' ').replace('OPR', 'Opera');
  }
  match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
  const temp = ua.match(/version\/(\d+)/i);
  if (temp !== null) match.splice(1, 1, temp[1]);
  return match.join(' ');
}

export default (Vue as WithRefs<Refs>).extend({
  name: 'BugReportDialog',
  props: {
    model: {
      type: Object as () => GameModel,
      required: false,
    },
    source: {
      type: String as () => Color | 'spectator',
    },
  },
  data() {
    return {
      message: `URL: ${spectatorUrl(this.model)}
Player color: ${this.source}
Version: ${raw_settings.head}, built at ${raw_settings.builtAt}
Browser: ${browser()}`,
      showCopied: false,
    };
  },
  methods: {
    show() {
      showModal(this.$refs.dialog);
    },
    copyTextArea() {
      this.$refs.textarea.select();
      navigator.clipboard.writeText(this.$refs.textarea.value);
      this.showCopied = true;
    },
  },
  mounted() {
    if (!windowHasHTMLDialogElement()) dialogPolyfill.default.registerDialog(this.$refs.dialog);
  },
});
</script>
