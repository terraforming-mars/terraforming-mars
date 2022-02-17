<template>
  <div class="language-switcher">
    <div
      v-for="lang in languages"
      :key="lang.id"
      :class="`language-icon language-icon--${lang.id}`"
      :title="lang.title"
      @click="switchLanguageTo(lang.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {LANGUAGES} from '@/common/constants';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'language-switcher',
  data() {
    return {
      languages: LANGUAGES,
      PreferencesManager,
    };
  },
  methods: {
    switchLanguageTo(langId: string) {
      this.PreferencesManager.save('lang', langId);
      window.location.reload();
    },
  },
});
</script>

<style lang="less" scoped>
.language-switcher {
  text-align: center;
}

.language-icon {
  margin-left: 10px;
  cursor: pointer;
  display: inline-block;
  width: 44px;
  height: 30px;
  border-radius: 50%;
  background: url(assets/flags_responsive.png) no-repeat;
  box-shadow: 0 2px 2px black;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.1);
  }

  &--en {
    background-position: 0 92.561983%;
  }

  &--de {
    background-position: 0 22.31405%;
  }

  &--fr {
    background-position: 0 29.752066%;
  }

  &--ru {
    background-position: 0 75.206612%;
  }

  &--cn {
    background-position: 0 19.005%;
  }

  &--pl {
    background-position: 0 70.66%;
  }

  &--es {
    background-position: 0 26.86%;
  }

  &--br {
    background-position: 0 12%;
  }

  &--it {
    background-position: 0 42.975207%;
  }
}
</style>
