<template>
    <!-- <div :class="recedeIfInactive"> -->
    <!-- Show the background, tooltip, and other setup -->
    <div class="filterDiv colony-card colonies tooltip tooltip-bottom" :class="backgroundClass" :data-tooltip="tooltip" v-i18n>

    <!-- Show colony ship if somebody is visiting -->
    <div v-if="colony.visitor !== undefined" class="colony-spaceship">
      <div :class="'colonies-fleet colonies-fleet-'+ colony.visitor"></div>
    </div>

    <!-- show the large title on top -->
    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>

    <div class="colony-content" :style="'margin-top: {{colonyContentOffset}}px;'">
    <!-- Bonus for colony owners when somebody trades -->
      <template v-if="metadata.colonyBonusType === ColonyBenefit.GAIN_RESOURCES">
        <template v-if="metadata.colonyBonusResource !== Resource.MEGACREDITS">
          <div v-for="n in metadata.colonyBonusQuantity" :key=n class="resource" :class="metadata.colonyBonusResource"></div>
        </template>
        <template v-else>
          <div class="resource" :class="metadata.colonyBonusResource">{{metadata.colonyBonusQuantity}}</div>
        </template>
      </template>
       <template v-if="metadata.colonyBonusType === ColonyBenefit.ADD_RESOURCES_TO_CARD">
        <div v-for="n in metadata.colonyBonusQuantity" :key=n class="resource" :class="colonyResourceClass"></div>
      </template>
      <div v-if="colony.name === ColonyName.MIRANDA" class="resource card card-with-border" style="transform:scale(0.8)" ></div>

      <template v-if="colony.name === ColonyName.IAPETUS" >
        <div class="resource card card-with-border" style="transform: scale(0.8);"></div>
        <span class="white-char">:</span>
        <div class="resource money">-1</div>
      </template>

      <div v-if="colony.name === ColonyName.TITANIA" class="resource money">-3</div>
      <div v-if="colony.name === ColonyName.VENUS" class="resource wild" style="margin:15px 10px 10px 20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>

      <div v-if="colony.name === ColonyName.PALLAS" style="display:inline-block">
        <div class="resource money">1</div> <span v-i18n>/ party</span> <div class="delegate"></div>
      </div>

      <template v-if="colony.name === ColonyName.LEAVITT">
        <span style="display: inline-block;margin-left: 10px;font-size: 14px;" v-i18n>REVEAL TOP CARD OF DECK.</span>
        <span><br></span>
        <span style="font-size: 14px; margin-left: 10px;" v-i18n>BUY OR DISCARD IT.</span>
      </template>

      <template v-if="colony.name === ColonyName.PLUTO">
        <span class="white-char" style="margin-left:5px;">+</span>
        <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
        <span class="white-char">-</span>
        <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
      </template>

      <div v-if="colony.name === ColonyName.DEIMOS" class="deimos-colony-bonus">
        <div class="resource money">1</div> / <div class="tile hazard-tile"></div>
      </div>

      <span class="colony-background-color">
        <template v-if="colony.name !== ColonyName.TITANIA"><span v-i18n>Bonus</span></template>
        <template v-else><span v-i18n>Colony Fee</span></template>
      </span>

      <br>

      <!-- Bonus for player who trades -->
      <template v-if="metadata.tradeType === ColonyBenefit.GAIN_RESOURCES">
        <div style="margin-left:20px;" class="resource" :class="metadata.tradeResource"></div>
        <div class="white-x"></div>
      </template>
       <template v-if="metadata.tradeType === ColonyBenefit.ADD_RESOURCES_TO_CARD">
        <div style="margin-left:20px;" class="resource" :class="colonyResourceClass"></div>
        <div class="white-x"></div>
      </template>

      <div v-if="colony.name === ColonyName.IAPETUS" class="tile rating" style="margin-left:20px; transform: scale(0.8); margin-top:-10px;"></div>
      <div v-if="colony.name === ColonyName.PLUTO" class="resource card card-with-border" style="margin-left:20px;transform: scale(0.8);margin-top: -8px;"></div>
      <div v-if="colony.name === ColonyName.EUROPA" style="height: 20px; visibility: hidden;display: block;" />

      <div v-if="colony.name === ColonyName.IAPETUS" class="white-x" style="margin-left:-42px;"></div>
      <div v-if="colony.name === ColonyName.TITANIA" class="white-x" style="margin-left:42px;"></div>
      <div v-if="colony.name === ColonyName.TITANIA" class="points points-big" style="margin-left: 10px; margin-top: -53px; transform: scale(0.5); height: 50px; width: 50px">&nbsp;</div>
      <div v-if="colony.name === ColonyName.PALLAS" class="white-x" style="margin-left:52px; margin-right: -30px;"></div>
      <div v-if="colony.name === ColonyName.PALLAS" class="delegate" style="margin-top:-23px; margin-right:5px"></div>
      <div v-if="colony.name === ColonyName.VENUS" class="white-x" style="margin-left:45px; margin-bottom:4px;"></div>
      <div v-if="colony.name === ColonyName.VENUS" class="resource wild" style="margin:10px 10px 10px -20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>
      <div v-if="colony.name === ColonyName.LEAVITT" class="resource card" style="margin-left:5px;transform: scale(0.8)"></div>
      <template>
        <span v-if="colony.name === ColonyName.PLUTO" class="colony-background-color" style="position:relative; top:-3px"
          v-i18n>Trade Income</span>
        <span v-else-if="colony.name === ColonyName.EUROPA" class="colony-background-color" style="margin-left: 3px;position: relative;top: -12px;"
          v-i18n>Trade Income: Gain the indicated production</span>
        <span v-else-if="colony.name === ColonyName.IAPETUS" class="colony-background-color" style="position:relative;top:-8px;left:30px"
          v-i18n>Trade Income</span>
        <span v-else-if="colony.name === ColonyName.TITANIA || colony.name === ColonyName.PALLAS" class="colony-background-color" style="position:relative;top:-14px;left:12px"
          v-i18n>Trade Income</span>
        <span v-else-if="colony.name === ColonyName.MERCURY" class="colony-background-color" style="margin-left: 3px;"
          v-i18n>Trade Income</span>
        <span v-else-if="colony.name === ColonyName.HYGIEA" class="colony-background-color" style="margin-left: 3px;"
          v-i18n>Trade Income: Steal 3 indicated resources</span>
        <span v-else-if="colony.name === ColonyName.LEAVITT" class="colony-background-color" style="margin-left: 3px;"
          v-i18n>Trade Income: Draw X cards and keep 1</span>
        <span v-else-if="colony.name === ColonyName.DEIMOS" class="colony-background-color" style="margin-left: 3px;"
          v-i18n>Trade Income: Erode X adjacent spaces</span>
        <span v-else class="colony-background-color" v-i18n>Trade Income</span>
      </template>

    <!-- Show the spaces for the player cubes and the white cube -->
    <colony-row :metadata="metadata" :colony="colony"></colony-row>
    <!-- show the numbers underneath the colony row -->
    <colony-trade-row :metadata="metadata"></colony-trade-row>
  </div>
<!-- </div> -->
</div>

</template>

<script lang="ts">

import Vue from 'vue';

import {ColonyModel} from '@/common/models/ColonyModel';
import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
import ColonyRow from '@/client/components/colonies/ColonyRow.vue';
import ColonyTradeRow from '@/client/components/colonies/ColonyTradeRow.vue';
import {getColony} from '@/client/colonies/ClientColonyManifest';
import {ColonyBenefit} from '@/common/colonies/ColonyBenefit';
import {Resource} from '@/common/Resource';
import {translateText} from '@/client/directives/i18n';

export default Vue.extend({
  name: 'colony',
  props: {
    colony: {
      type: Object as () => ColonyModel,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ColonyRow,
    ColonyTradeRow,
  },
  computed: {
    metadata(): IColonyMetadata {
      return getColony(this.colony.name);
    },
    colonyResourceClass(): string {
      const resource = this.metadata.cardResource;
      return resource?.toString()?.toLowerCase() ?? '';
    },
    recedeIfInactive(): string {
      return this.active === false ? 'inactiveColony' : '';
    },
    backgroundClass(): string {
      return this.colony.name.replace(' ', '-') + '-background';
    },
    tooltip(): string {
      const descriptions = this.metadata.description;
      const titles = ['Build Colony bonus', 'Trade bonus', 'Colony bonus'].map(translateText);

      return `${titles[0]}: ${translateText(descriptions.buildBonus)}
${titles[1]}: ${translateText(descriptions.tradeBonus)}
${titles[2]}: ${translateText(descriptions.colonyBonus)}`;
    },
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
    ColonyBenefit(): typeof ColonyBenefit {
      return ColonyBenefit;
    },
    Resource(): typeof Resource {
      return Resource;
    },
  },
});
</script>
