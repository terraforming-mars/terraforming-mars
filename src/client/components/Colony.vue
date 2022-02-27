<template>
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'" v-i18n>
    <div v-if="colony.visitor !== undefined" class="colony-spaceship">
      <div :class="'colonies-fleet colonies-fleet-'+ colony.visitor"></div>
    </div>
    <div v-if="colony.isActive" :style="`margin-left: ${cubeXPosition}px; margin-top:${cubeYPosition + colonyCubeOffset}px;`" class="colony_cube"></div>
    <template v-for="idx in [0, 1, 2]">
      <div :key="idx" v-if="colony.colonies.length > idx" :style="`margin-left: ${colonyXPositions[idx]}px;  margin-top:${cubeYPosition}px;`" class="occupied-colony-space">
        <div :class="'board-cube colony-cube board-cube--' + colony.colonies[idx]"></div>
      </div>
    </template>

    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>
    <div class="colony-content" :style="'margin-top: {{colonyContentOffset}}px;'">
      <div v-if="colony.name === ColonyName.GANYMEDE" class="resource plant"></div>
      <div v-if="colony.name === ColonyName.EUROPA" class="resource money">1</div>
      <div v-if="colony.name === ColonyName.TITAN" class="resource floater"></div>
      <div v-if="colony.name === ColonyName.ENCELADUS" class="resource microbe"></div>
      <div v-if="colony.name === ColonyName.CALLISTO" class="resource energy"></div>
      <div v-if="colony.name === ColonyName.CALLISTO" class="resource energy"></div>
      <div v-if="colony.name === ColonyName.CALLISTO" class="resource energy"></div>
      <div v-if="colony.name === ColonyName.TRITON" class="resource titanium"></div>
      <div v-if="colony.name === ColonyName.MIRANDA" class="resource card card-with-border" style="transform:scale(0.8)" ></div>
      <div v-if="colony.name === ColonyName.CERES" class="resource steel"></div>
      <div v-if="colony.name === ColonyName.CERES" class="resource steel"></div>
      <div v-if="colony.name === ColonyName.IO" class="resource heat"></div>
      <div v-if="colony.name === ColonyName.IO" class="resource heat"></div>
      <div v-if="colony.name === ColonyName.LUNA" class="resource money">2</div>

      <template v-if="colony.name === ColonyName.IAPETUS" >
        <div class="resource card card-with-border" style="transform: scale(0.8);"></div>
        <span class="white-char">:</span>
        <div class="resource money">-1</div>
      </template>

      <div v-if="colony.name === ColonyName.MERCURY" class="resource money">2</div>
      <div v-if="colony.name === ColonyName.HYGIEA" class="resource money">3</div>
      <div v-if="colony.name === ColonyName.TITANIA" class="resource money">-3</div>
      <div v-if="colony.name === ColonyName.VENUS" class="resource" style="background:white;margin:15px 10px 10px 20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>

      <div v-if="colony.name === ColonyName.PALLAS" style="display:inline-block">
        <div class="resource money">1</div> / party <div class="delegate"></div>
      </div>

      <template v-if="colony.name === ColonyName.LEAVITT">
        <span style="display: inline-block;margin-left: 10px;font-size: 14px;">REVEAL TOP CARD OF DECK.</span>
        <span><br></span>
        <span style="font-size: 14px; margin-left: 10px;">BUY OR DISCARD IT.</span>
      </template>

      <template v-if="colony.name === ColonyName.PLUTO">
        <span class="white-char" style="margin-left:5px;">+</span>
        <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
        <span class="white-char">-</span>
        <div class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
      </template>

      <span class="colony-background-color">
        <template v-if="colony.name !== ColonyName.TITANIA">
          Colony Bonus
        </template>
        <template v-else>
          Colony Fee
        </template>
      </span>

      <br>

      <div v-if="colony.name === ColonyName.GANYMEDE" class="resource plant" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.TITAN" class="resource floater" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.ENCELADUS" class="resource microbe" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.CALLISTO" class="resource energy" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.TRITON" class="resource titanium" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.CERES" class="resource steel" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.LUNA" class="resource money" style="margin-left:20px;">&nbsp;</div>
      <div v-if="colony.name === ColonyName.IAPETUS" class="tile rating" style="margin-left:20px; transform: scale(0.8); margin-top:-10px;"></div>
      <div v-if="colony.name === ColonyName.IO" class="resource heat" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.MIRANDA" class="resource animal" style="margin-left:20px;"></div>
      <div v-if="colony.name === ColonyName.PLUTO" class="resource card card-with-border" style="margin-left:20px;transform: scale(0.8);margin-top: -8px;"></div>
      <div v-if="colony.name === ColonyName.EUROPA" style="height: 20px; visibility: hidden;display: block;" />
      <div v-if="colony.name !== ColonyName.EUROPA && colony.name !== ColonyName.MERCURY && colony.name !== ColonyName.IAPETUS && colony.name !== ColonyName.HYGIEA && colony.name !== ColonyName.TITANIA && colony.name !== ColonyName.VENUS && colony.name !== ColonyName.LEAVITT && colony.name !== ColonyName.PALLAS" class="white-x"></div>
      <div v-if="colony.name === ColonyName.IAPETUS" class="white-x" style="margin-left:-42px;"></div>
      <div v-if="colony.name === ColonyName.TITANIA" class="white-x" style="margin-left:42px;"></div>
      <div v-if="colony.name === ColonyName.TITANIA" class="points points-big" style="margin-left: 10px; margin-top: -53px; transform: scale(0.5); height: 50px; width: 50px">&nbsp;</div>
      <div v-if="colony.name === ColonyName.PALLAS" class="white-x" style="margin-left:52px; margin-right: -30px;"></div>
      <div v-if="colony.name === ColonyName.PALLAS" class="delegate" style="margin-top:-23px; margin-right:5px"></div>
      <div v-if="colony.name === ColonyName.VENUS" class="white-x" style="margin-left:45px; margin-bottom:4px;"></div>
      <div v-if="colony.name === ColonyName.VENUS" class="resource" style="background:white;margin:10px 10px 10px -20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>
      <div v-if="colony.name === ColonyName.LEAVITT" class="resource card" style="margin-left:5px;transform: scale(0.8)"></div>
      <span v-if="colony.name !== ColonyName.EUROPA && colony.name !== ColonyName.PLUTO && colony.name !== ColonyName.MERCURY && colony.name !== ColonyName.IAPETUS && colony.name !== ColonyName.HYGIEA && colony.name !== ColonyName.TITANIA && colony.name !== ColonyName.LEAVITT && colony.name !== ColonyName.PALLAS" class="colony-background-color">
        Trade Income
      </span>
      <span v-if="colony.name === ColonyName.PLUTO" class="colony-background-color" style="position:relative; top:-3px">
        Trade Income
      </span>
      <span v-if="colony.name === ColonyName.EUROPA" class="colony-background-color" style="margin-left: 3px;position: relative;top: -12px;">
        Trade Income: Gain the indicated production
      </span>
      <span v-if="colony.name === ColonyName.IAPETUS" class="colony-background-color" style="position:relative;top:-8px;left:30px">
        Trade Income
      </span>
      <span v-if="colony.name === ColonyName.TITANIA || colony.name === ColonyName.PALLAS" class="colony-background-color" style="position:relative;top:-14px;left:12px">
        Trade Income
      </span>
      <span v-if="colony.name === ColonyName.MERCURY" class="colony-background-color" style="margin-left: 3px;">
        Trade Income
      </span>
      <span v-if="colony.name === ColonyName.HYGIEA" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Steal 3 indicated resources
      </span>
      <span v-if="colony.name === ColonyName.LEAVITT" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Draw X cards and keep 1
      </span>

    <div v-if="colony.name === ColonyName.ENCELADUS" class="colony-grid-container">
      <div>
        <div class="colony-placement-bonus triple-res resource microbe white-x white-x--3"></div>
      </div>

      <div>
        <div class="colony-placement-bonus triple-res resource microbe white-x white-x--3"></div>
      </div>

      <div>
        <div class="colony-placement-bonus triple-res resource microbe white-x white-x--3"></div>
      </div>

      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.ENCELADUS" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>4</div>
      <div>5</div>
    </div>

    <div v-if="colony.name === ColonyName.PLUTO" class="colony-grid-container">
      <div>
        <div class="resource card card-with-border" style="margin-top: 0px; margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card card-with-border" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
      </div>
      <div>
        <div class="resource card card-with-border" style="margin-top: 0px; margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card card-with-border" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
      </div>
      <div>
        <div class="resource card card-with-border" style="margin-top: 0px; margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card card-with-border" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.PLUTO" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>2</div>
      <div>3</div>
      <div>3</div>
      <div>4</div>
    </div>

    <div v-if="colony.name === ColonyName.MIRANDA" class="colony-grid-container">
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.MIRANDA" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
      <div>2</div>
      <div>3</div>
      <div>3</div>
    </div>

    <div v-if="colony.name === ColonyName.IO" class="colony-grid-container">
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.IO" class="colony-grid-container2">
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>6</div>
      <div>8</div>
      <div>10</div>
      <div>13</div>
    </div>

    <div v-if="colony.name === ColonyName.LUNA" class="colony-grid-container">
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.LUNA" class="colony-grid-container2">
      <div>1</div>
      <div>2</div>
      <div>4</div>
      <div>7</div>
      <div>10</div>
      <div>13</div>
      <div>17</div>
    </div>

    <div v-if="colony.name === ColonyName.IAPETUS" class="colony-grid-container">
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.IAPETUS" class="colony-grid-container2">
      <div>0</div>
      <div>0</div>
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
    </div>

    <div v-if="colony.name === ColonyName.CERES" class="colony-grid-container">
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.CERES" class="colony-grid-container2">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>6</div>
      <div>8</div>
      <div>10</div>
    </div>

    <div v-if="colony.name === ColonyName.TRITON" class="colony-grid-container">
      <div>
        <div class="colony-placement-bonus resource triple-res titanium white-x white-x--3"></div>
      </div>

      <div>
        <div class="colony-placement-bonus resource triple-res titanium white-x white-x--3"></div>
      </div>

      <div>
        <div class="colony-placement-bonus resource triple-res titanium white-x white-x--3"></div>
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.TRITON" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </div>

    <div v-if="colony.name === ColonyName.GANYMEDE" class="colony-grid-container">
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === ColonyName.GANYMEDE" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </div>

    <div v-if="colony.name === ColonyName.CALLISTO" class="colony-grid-container">
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.CALLISTO" class="colony-grid-container2">
    <div>0</div>
    <div>2</div>
    <div>3</div>
    <div>5</div>
    <div>7</div>
    <div>10</div>
    <div>13</div>
  </div>

  <div v-if="colony.name === ColonyName.EUROPA" class="colony-grid-container">
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.EUROPA" class="colony-grid-container2">
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
  </div>

  <div v-if="colony.name === ColonyName.PALLAS" class="colony-grid-container">
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
    <div v-if="colony.name === ColonyName.PALLAS" class="colony-grid-container2">
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>3</div>
  </div>

  <div v-if="colony.name === ColonyName.MERCURY" class="colony-grid-container">
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.MERCURY" class="colony-grid-container2">
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
  </div>

  <div v-if="colony.name === ColonyName.HYGIEA" class="colony-grid-container">
    <div>
      <div class="resource card red-outline" style="margin-left: 5px; margin-top: 2px; transform: scale(0.8);"></div>
    </div>
    <div>
      <div class="resource card red-outline" style="margin-left: 5px; margin-top: 2px; transform: scale(0.8);"></div>
    </div>
    <div>
      <div class="resource card red-outline" style="margin-left: 5px; margin-top: 2px; transform: scale(0.8);"></div>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.HYGIEA" class="colony-grid-container2">
    <div><div class="resource money red-outline"></div></div>
    <div><div class="resource money red-outline"></div></div>
    <div><div class="resource heat red-outline"></div></div>
    <div><div class="resource energy red-outline"></div></div>
    <div><div class="resource plant red-outline"></div></div>
    <div><div class="resource steel red-outline"></div></div>
    <div><div class="resource titanium red-outline"></div></div>
  </div>

  <div v-if="colony.name === ColonyName.TITANIA" class="colony-grid-container">
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">5</div></div>
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">3</div></div>
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">2</div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.TITANIA" class="colony-grid-container2">
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>1</div>
    <div>1</div>
    <div>0</div>
    <div>0</div>
  </div>

  <div v-if="colony.name === ColonyName.VENUS" class="colony-grid-container" style="margin-top:5px;">
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.VENUS" class="colony-grid-container2" style="margin-top:55px;">
    <div>0</div>
    <div>0</div>
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>

  <div v-if="colony.name === ColonyName.LEAVITT" class="colony-grid-container">
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.LEAVITT" class="colony-grid-container2">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </div>

  <div v-if="colony.name === ColonyName.TITAN" class="colony-grid-container">
    <div>
      <div class="colony-placement-bonus triple-res resource floater white-x white-x--3"></div>
    </div>

    <div>
      <div class="colony-placement-bonus triple-res resource floater white-x white-x--3"></div>
    </div>

    <div>
      <div class="colony-placement-bonus triple-res resource floater white-x white-x--3"></div>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === ColonyName.TITAN" class="colony-grid-container2">
    <div>0</div>
    <div>1</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>3</div>
    <div>4</div>
  </div>

  </div>
</div>

</template>

<script lang="ts">

import Vue from 'vue';

import {ColonyModel} from '@/common/models/ColonyModel';
import {ColonyName} from '@/common/colonies/ColonyName';

export default Vue.extend({
  name: 'colony',
  props: {
    colony: {
      type: Object as () => ColonyModel,
    },
  },
  computed: {
    cubeXPosition(): number {
      return this.colony.trackPosition * 56 + 27;
    },
    colonyXPositions(): Array<number> {
      return [0, 1, 2].map((index) => index * 56 + 16);
    },
    colonyCubeOffset(): number {
      return 7;
    },
    cubeYPosition(): number {
      switch (this.colony.name) {
      case ColonyName.IAPETUS:
      case ColonyName.LEAVITT:
        return 181;
      case ColonyName.VENUS:
        return 186;
      case ColonyName.PALLAS:
        return 168;
      case ColonyName.MERCURY:
      case ColonyName.HYGIEA:
        return 144;
      case ColonyName.EUROPA:
      case ColonyName.MIRANDA:
        return 166;
      case ColonyName.PLUTO:
        return 165;
      case ColonyName.LUNA:
        return 163;
      default:
        return 164;
      }
    },
    getColonyContentOffset(): number {
      if (this.colony.name === ColonyName.PLUTO || this.colony.name === ColonyName.MIRANDA) return -12;
      return 0;
    },
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
  },
});
</script>
