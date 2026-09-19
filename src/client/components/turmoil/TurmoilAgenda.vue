<template>
  <div>
    <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- .card-container is what all of the card item/row styling in cards_v2.less hangs off of. -->
    <div class="card-container agenda-render-data" v-if="renderData !== undefined">
      <CardRenderData :renderData="renderData" />
    </div>
    <template v-else-if="id === 'mb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-building party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'mb02'">
      <div class="resource money party-resource">1</div> /
      <div class="tile empty-tile tile-size--S"></div>ON MARS
    </template>
    <template v-else-if="id === 'sb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-science party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'sb02'">
      <div class="resource money party-resource">1</div> / 3
      <div class="resource card card-small"></div>
    </template>
    <template v-else-if="id === 'ub01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-venus party-resource-tag"></div>
      <div class="resource-tag tag-earth party-resource-tag"></div>
      <div class="resource-tag tag-jovian party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'ub02'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-space party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'kb01'">
      <div class="resource money party-resource">1</div> /
      <div class="production-box party-production-box">
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'kb02'">
      <div class="resource heat party-resource"></div> /
      <div class="production-box party-production-box">
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'rb01'">
      <div class="party-inferior-rating tile party-rating party-tile">&lt;</div> :
      <div class="rating tile party-rating party-tile"></div>
    </template>
    <template v-else-if="id === 'rb02'">
      <div class="party-inferior-rating tile party-rating party-tile">&gt;</div> :
      <div class="rating tile party-rating party-tile red-outline "></div>
    </template>
    <template v-else-if="id === 'gb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-plant party-resource-tag"></div>
      <div class="resource-tag tag-microbe party-resource-tag"></div>
      <div class="resource-tag tag-animal party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'gb02'">
      <div class="resource money party-resource">2</div> /
      <div class="tile greenery-tile-turmoil greenery-tile-small"></div>
    </template>
    <template v-else-if="id === 'mp01'">
      <div class="policy-top-margin"><div v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></div><div class="tile empty-tile tile-size--S"></div> : <span class="steel resource"></span></div>
    </template>
    <template v-else-if="id === 'mp02'">
      <div class="policy-top-margin"><div class="resource-tag tag-building"></div> : <div class="money resource">2</div></div>
    </template>
    <template v-else-if="id === 'mp03'">
      <div class="policy-top-margin"><div class="resource steel"></div> : +<div class="resource money">1</div></div>
    </template>
    <template v-else-if="id === 'mp04'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-building"></div></div>
    </template>
    <template v-else-if="id === 'sp01'">
      <span v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></span>
      <span class="money resource">10</span>
      <span class="red-arrow"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
    </template>
    <template v-else-if="id === 'sp02'">
      <span>
        <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
        <div class="tile ocean-tile req-tile-small"></div>
        <div class="tile temperature-tile req-tile-small"></div>
        : ± 2
      </span>
    </template>
    <template v-else-if="id === 'sp03'">
      <span>
        <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
        <div class="tile ocean-tile req-tile-small"></div>
        <div class="tile temperature-tile req-tile-small"></div>
        : <div class="resource card card-with-border"></div>
      </span>
    </template>
    <template v-else-if="id === 'sp04'">
      <div class="scientists-requisite"><div class="resource-tag tag-science party-resource-tag"></div></div>
    </template>
    <template v-else-if="id === 'up01'">
      <div class="policy-top-margin"><div v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></div><div class="resource titanium"></div> : + <div class="resource money">1</div></div>
    </template>
    <template v-else-if="id === 'up02'">
      <div class="policy-top-margin">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>2<span class="titanium resource"></span> / 2<span class="floater resource"></span>
      </div>
    </template>
    <template v-else-if="id === 'up03'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-space"></div></div>
    </template>
    <template v-else-if="id === 'up04'">
      <div class="policy-top-margin"><div class="resource-tag tag-space"></div> : <div class="money resource">-2</div></div>
    </template>
    <template v-else-if="id === 'kp01'">
      <span v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></span>
      <span class="money resource">10</span>
      <span class="red-arrow-infinity"></span>
      <div class="production-box production-box-size2">
        <div class="energy production"></div>
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'kp02'">
      <div class="tile temperature-tile req-tile-small" style="margin-right:5px;"></div> : <span class="money resource">3</span>
    </template>
    <template v-else-if="id === 'kp03'">
      6 <span class="heat resource"></span>
      <span class="red-arrow-infinity"></span>
      <div class="tile temperature-tile"></div>
    </template>
    <template v-else-if="id === 'kp04'">
      <div class="policy-top-margin"><div class="tile empty-tile tile-size--S"></div> :
      <span class="heat resource"></span><span class="heat resource"></span></div>
    </template>
    <template v-else-if="id === 'rp01'">
      <div class="policy-top-margin">
      <div v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></div>
      <div class="rating tile"></div> :
      <div class="resource money">-3</div>
      </div>
    </template>
    <template v-else-if="id === 'rp02'">
      <div class="policy-top-margin"><div class="tile empty-tile tile-size--S"></div> : <span class="money resource">-3</span></div>
    </template>
    <template v-else-if="id === 'rp03'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="tile oxygen-tile req-tile-small red-outline" style="margin: 10px -5px;"></div> /
      <div class="tile ocean-tile req-tile-small red-outline"></div> /
      <div class="tile temperature-tile req-tile-small red-outline"></div>
    </template>
    <template v-else-if="id === 'rp04'">
      <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
      <div class="tile ocean-tile req-tile-small"></div>
      <div class="tile temperature-tile req-tile-small"></div>
      : <div class="production-box production-box-size2" style="margin-left:5px;">
        <div class="production-prefix minus"></div><div class="money production">1</div>
      </div>
    </template>
    <template v-else-if="id === 'gp01'">
      <div v-if="showPartyBadge" :class="partyBadgeClass" v-i18n></div>
      <div class="tile greenery-tile-turmoil"></div> : <div class="resource money">4</div>
    </template>
    <template v-else-if="id === 'gp02'">
      <div class="policy-top-margin"><div class="tile empty-tile tile-size--S"></div> : <span class="plant resource"></span></div>
    </template>
    <template v-else-if="id === 'gp03'">
      <div class="policy-top-margin">
      <div class="resource-tag tag-plant party-resource-tag"></div>
      <div class="resource-tag tag-microbe party-resource-tag"></div>
      <div class="resource-tag tag-animal party-resource-tag"></div> : <div class="resource money">2</div>
      </div>
    </template>
    <template v-else-if="id === 'gp04'">
      <div class="policy-top-margin">
      <span class="money resource">5</span>
      <span class="red-arrow-3x"></span>3<span class="plant resource"></span> / 2<span class="microbe resource"></span>
      </div>
    </template>
    <template v-else>
      <div>Unknown agenda ID {{id}}</div>
    </template>
    </div>
    <Teleport to="body">
      <div
        v-if="showTooltip"
        class="agenda-tooltip-portal"
        v-i18n
        :style="{top: tooltipTop + 'px', left: tooltipLeft + 'px'}">
        {{ resolvedDescription }}
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">

import {getAgendaOrThrow} from '@/client/turmoil/ClientAgendaManifest';
import {BonusId, PolicyId} from '@/common/turmoil/Types';
import {ICardRenderRoot, isICardRenderRoot} from '@/common/cards/render/Types';
import CardRenderData from '@/client/components/card/CardRenderData.vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'TurmoilAgenda',
  components: {
    CardRenderData,
  },
  props: {
    id: {
      type: String as () => BonusId | PolicyId,
      required: true,
    },
    showPartyBadge: {
      type: Boolean,
      default: false,
    },
    /** When true, render from the agenda's renderData instead of the hand-written markup. */
    useRenderData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTooltip: false,
      tooltipTop: 0,
      tooltipLeft: 0,
    };
  },
  computed: {
    partyBadgeClass(): string {
      const partyBadgeSlugs: Record<string, string> = {
        m: 'mars_first',
        s: 'scientists',
        u: 'unity',
        k: 'kelvinists',
        r: 'reds',
        g: 'greens',
      };
      return 'party-badge party-badge--' + partyBadgeSlugs[this.id[0]];
    },
    resolvedDescription(): string {
      return getAgendaOrThrow(this.id).description;
    },
    /** Undefined when this agenda renders as the hand-written markup in the template. */
    renderData(): ICardRenderRoot | undefined {
      if (this.useRenderData !== true) {
        return undefined;
      }
      const renderData = getAgendaOrThrow(this.id).renderData;
      return isICardRenderRoot(renderData) ? renderData : undefined;
    },
  },
  methods: {
    onMouseEnter(event: MouseEvent) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.tooltipTop = rect.bottom + 6;
      this.tooltipLeft = rect.left + rect.width / 2;
      this.showTooltip = true;
    },
    onMouseLeave() {
      this.showTooltip = false;
    },
  },
});

</script>

<style scoped lang="less">
.agenda-render-data {
  // `.card-text-normal` (added by isBold: false) sets font-size: 11px alongside
  // the weight, and being defined later at equal specificity it overrides the
  // size class. Keep the weight, restore the size. Values mirror
  // @font_size_normal / @font_size_big, which scoped styles can't reach.
  :deep(.card-text-normal) {
    line-height: normal;

    &.card-text-size--M {
      font-size: 18px;
    }

    &.card-text-size--L {
      font-size: 23px;
    }
  }

  // rb01/rb02's "lowest/highest TR" marker. The turmoil markup draws it with
  // `.party-inferior-rating`; `plate()` is the nearest render item, so reshape
  // it to match rather than invent an item type for two agendas.
  :deep(.card-plate) {
    // `plate()` forces isBold and `.card-plate` sets font-weight: bold; the
    // turmoil marker is drawn with a normal weight.
    font-weight: normal;
    width: 30px;
    font-size: 30px;
    line-height: 30px;
    border-radius: 0;
    background: linear-gradient(orange, orangered);
  }

  // Card items are spaced for a full-size card. An agenda renders in a much
  // smaller box, where that reads as a gap between a run of tags.
  :deep(.card-item-container) {
    margin-left: 0;
    margin-right: 0;

    // Tags carry side margins of their own on top of the container's, and at
    // 30px they read as small next to the tiles. Scaled to 40px, matching a
    // medium tile's width; the background numbers keep the base ratio.
    > .card-resource-tag {
      margin-left: 0;
      margin-right: 0;
      width: 40px;
      height: 40px;
      background-size: 45px 45px;
      background-position: -3px;
      line-height: 38px;
    }
  }
}
</style>
