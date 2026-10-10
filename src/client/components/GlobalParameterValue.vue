<template>
<div :title="$t(title)">
  <div :class="iconClass"></div>
  <div class="global_params_value">
    <div v-if="isMax">
      <img src="assets/misc/checkmark.png" class="checkmark" :alt="$t('Completed!')">
    </div>
    <div v-else>
      {{value}}{{suffix}}
    </div>
  </div>
</div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {GlobalParameter} from '@/common/GlobalParameter';
import {BoardName} from '@/common/boards/BoardName';
import {getGlobalParameterMaximums} from '@/common/boards/GlobalParameterMaximums';

type BaseGlobalParameter = 'temperature' | 'oxygen' | 'oceans' | 'venus';

const attributes: Record<BaseGlobalParameter, {title: string, iconClass: string}> = {
  [GlobalParameter.TEMPERATURE]: {title: 'Temperature', iconClass: 'temperature-tile'},
  [GlobalParameter.OXYGEN]: {title: 'Oxygen Level', iconClass: 'oxygen-tile'},
  [GlobalParameter.OCEANS]: {title: 'Oceans', iconClass: 'ocean-tile'},
  [GlobalParameter.VENUS]: {title: 'Venus Scale', iconClass: 'venus-tile'},
};

export default defineComponent({
  name: 'GlobalParameterValue',
  props: {
    param: {
      type: String as () => BaseGlobalParameter,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    boardName: {
      type: String as () => BoardName,
      required: true,
    },
  },
  computed: {
    // Maximum value of this parameter, which depends on the map (the larger maps raise them).
    max(): number {
      const maximums = getGlobalParameterMaximums(this.boardName);
      const byParam: Record<BaseGlobalParameter, number> = {
        [GlobalParameter.TEMPERATURE]: maximums.temperature,
        [GlobalParameter.OXYGEN]: maximums.oxygen,
        [GlobalParameter.OCEANS]: maximums.oceans,
        [GlobalParameter.VENUS]: maximums.venus,
      };
      return byParam[this.param];
    },
    isMax(): boolean {
      return this.value === this.max;
    },
    title(): string {
      return attributes[this.param].title;
    },
    iconClass(): string {
      return attributes[this.param].iconClass;
    },
    suffix(): string {
      return this.param === GlobalParameter.OXYGEN ? '%' : '';
    },
  },
});

</script>
