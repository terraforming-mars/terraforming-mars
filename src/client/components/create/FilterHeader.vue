<template>
  <div class="corporations-filter-toolbox-cont">
    <h2 v-i18n>{{ title }}</h2>
    <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
        <a href="#" v-i18n v-on:click.prevent="emit('select')">All*</a> |
        <a href="#" v-i18n v-on:click.prevent="emit('unselect')">None*</a> |
        <a href="#" v-i18n v-on:click.prevent="emit('invert')">Invert*</a>
        <input ref="filter" class="filter" :placeholder="$t('filter')" v-model="filterText">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {Expansion, GameModule, GAME_MODULES} from '@/common/cards/GameModule';
import {byModule, byType, getCard, getCards} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {toName} from '@/common/utils/utils';

type Group = GameModule | 'All';

export default Vue.extend({
  name: 'FilterHeader',
  props: {
    title: String,
  },
  data() {
    return {
      filterText: '',
    };
  },
  computed: {
    GAME_MODULES(): typeof GAME_MODULES {
      return GAME_MODULES;
    },
  },
  methods: {
    emit(type: string) {
      this.$emit('select-all', type);
    },
  },
});
</script>
