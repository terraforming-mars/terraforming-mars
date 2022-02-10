<template>
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'" v-i18n>
    <div v-if="colony.visitor !== undefined" class="colony-spaceship">
      <div :class="'colonies-fleet colonies-fleet-'+ colony.visitor"></div>
    </div>
    <div v-if="colony.isActive" :style="'margin-left:' + getCubeXPosition(colony) + 'px; margin-top:' + getCubeYPosition(colony, true) + 'px;'" class="colony_cube"></div>
    <div v-if="colony.colonies.length > 0" :style="'margin-left: ' + getColonyXPosition(0) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" class="occupied-colony-space">
      <div :class="'board-cube colony-cube board-cube--' + colony.colonies[0]"></div>
    </div>
    <div v-if="colony.colonies.length > 1" :style="'margin-left: ' + getColonyXPosition(1) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" class="occupied-colony-space">
      <div :class="'board-cube colony-cube board-cube--' + colony.colonies[1]"></div>
    </div>
    <div v-if="colony.colonies.length > 2" :style="'margin-left: ' + getColonyXPosition(2) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" class="occupied-colony-space">
      <div :class="'board-cube colony-cube board-cube--' + colony.colonies[2]"></div>
    </div>

    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>
    <div class="colony-content" :style="'margin-top: ' + getColonyContentOffset(colony) + 'px;'">
      <div v-if="colony.name === getGanymede()" class="resource plant"></div>
      <div v-if="colony.name === getEuropa()" class="resource money">1</div>
      <div v-if="colony.name === getTitan()" class="resource floater"></div>
      <div v-if="colony.name === getEnceladus()" class="resource microbe"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getTriton()" class="resource titanium"></div>
      <div v-if="colony.name === getMiranda()" style="transform:scale(0.8)" class="resource card card-with-border"></div>
      <div v-if="colony.name === getCeres()" class="resource steel"></div>
      <div v-if="colony.name === getCeres()" class="resource steel"></div>
      <div v-if="colony.name === getIo()" class="resource heat"></div>
      <div v-if="colony.name === getIo()" class="resource heat"></div>
      <div v-if="colony.name === getLuna()" class="resource money">2</div>

      <div v-if="colony.name === getIapetus()" class="resource card card-with-border" style="transform: scale(0.8);"></div>
      <span v-if="colony.name === getIapetus()" class="white-char">:</span>
      <div v-if="colony.name === getIapetus()" class="resource money">-1</div>

      <div v-if="colony.name === getMercury()" class="resource money">2</div>
      <div v-if="colony.name === getHygiea()" class="resource money">3</div>
      <div v-if="colony.name === getTitania()" class="resource money">-3</div>
      <div v-if="colony.name === getVenus()" class="resource" style="background:white;margin:15px 10px 10px 20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>

      <div v-if="colony.name === getPallas()" style="display:inline-block">
        <div class="resource money">1</div> / party <div class="delegate"></div>
      </div>

      <span v-if="colony.name === getLeavitt()" style="display: inline-block;margin-left: 10px;font-size: 14px;">REVEAL TOP CARD OF DECK.</span>
      <span v-if="colony.name === getLeavitt()"><br></span>
      <span v-if="colony.name === getLeavitt()" style="font-size: 14px; margin-left: 10px;">BUY OR DISCARD IT.</span>

      <span v-if="colony.name === getPluto()" class="white-char" style="margin-left:5px;">+</span>
      <div v-if="colony.name === getPluto()" class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>
      <span v-if="colony.name === getPluto()" class="white-char">-</span>
      <div v-if="colony.name === getPluto()" class="resource card card-with-border" style="transform: scale(0.8);margin-left:-2px;"></div>

      <span v-if="colony.name !== getTitania()" class="colony-background-color">
        Colony Bonus
      </span>
      <span v-if="colony.name === getTitania()" class="colony-background-color">
        Colony Fee
      </span>
      <br>
      <div v-if="colony.name === getGanymede()" class="resource plant" style="margin-left:20px;"></div>
      <div v-if="colony.name === getTitan()" class="resource floater" style="margin-left:20px;"></div>
      <div v-if="colony.name === getEnceladus()" class="resource microbe" style="margin-left:20px;"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy" style="margin-left:20px;"></div>
      <div v-if="colony.name === getTriton()" class="resource titanium" style="margin-left:20px;"></div>
      <div v-if="colony.name === getCeres()" class="resource steel" style="margin-left:20px;"></div>
      <div v-if="colony.name === getLuna()" class="resource money" style="margin-left:20px;">&nbsp;</div>
      <div v-if="colony.name === getIapetus()" class="tile rating" style="margin-left:20px; transform: scale(0.8); margin-top:-10px;"></div>
      <div v-if="colony.name === getIo()" class="resource heat" style="margin-left:20px;"></div>
      <div v-if="colony.name === getMiranda()" class="resource animal" style="margin-left:20px;"></div>
      <div v-if="colony.name === getPluto()" class="resource card card-with-border" style="margin-left:20px;transform: scale(0.8);margin-top: -8px;"></div>
      <div v-if="colony.name === getEuropa()" style="height: 20px; visibility: hidden;display: block;" />
      <div v-if="colony.name !== getEuropa() && colony.name !== getMercury() && colony.name !== getIapetus() && colony.name !== getHygiea() && colony.name !== getTitania() && colony.name !== getVenus() && colony.name !== getLeavitt() && colony.name !== getPallas()" class="white-x"></div>
      <div v-if="colony.name === getIapetus()" class="white-x" style="margin-left:-42px;"></div>
      <div v-if="colony.name === getTitania()" class="white-x" style="margin-left:42px;"></div>
      <div v-if="colony.name === getTitania()" class="points points-big" style="margin-left: 10px; margin-top: -53px; transform: scale(0.5); height: 50px; width: 50px">&nbsp;</div>
      <div v-if="colony.name === getPallas()" class="white-x" style="margin-left:52px; margin-right: -30px;"></div>
      <div v-if="colony.name === getPallas()" class="delegate" style="margin-top:-23px; margin-right:5px"></div>
      <div v-if="colony.name === getVenus()" class="white-x" style="margin-left:45px; margin-bottom:4px;"></div>
      <div v-if="colony.name === getVenus()" class="resource" style="background:white;margin:10px 10px 10px -20px;">?<div class="card-icon tag-venus" style="color: white;margin-top: -36px;margin-left: 16px;"></div></div>
      <div v-if="colony.name === getLeavitt()" class="resource card" style="margin-left:5px;transform: scale(0.8)"></div>
      <span v-if="colony.name !== getEuropa() && colony.name !== getPluto() && colony.name !== getMercury() && colony.name !== getIapetus() && colony.name !== getHygiea() && colony.name !== getTitania() && colony.name !== getLeavitt() && colony.name !== getPallas()" class="colony-background-color">
        Trade Income
      </span>
      <span v-if="colony.name === getPluto()" class="colony-background-color" style="position:relative; top:-3px">
        Trade Income
      </span>
      <span v-if="colony.name === getEuropa()" class="colony-background-color" style="margin-left: 3px;position: relative;top: -12px;">
        Trade Income: Gain the indicated production
      </span>
      <span v-if="colony.name === getIapetus()" class="colony-background-color" style="position:relative;top:-8px;left:30px">
        Trade Income
      </span>
      <span v-if="colony.name === getTitania() || colony.name === getPallas()" class="colony-background-color" style="position:relative;top:-14px;left:12px">
        Trade Income
      </span>
      <span v-if="colony.name === getMercury()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income
      </span>
      <span v-if="colony.name === getHygiea()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Steal 3 indicated resources
      </span>
      <span v-if="colony.name === getLeavitt()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Draw X cards and keep 1
      </span>

    <div v-if="colony.name === getEnceladus()" class="colony-grid-container">
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
    <div v-if="colony.name === getEnceladus()" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>4</div>
      <div>5</div>
    </div>

    <div v-if="colony.name === getPluto()" class="colony-grid-container">
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
    <div v-if="colony.name === getPluto()" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>2</div>
      <div>3</div>
      <div>3</div>
      <div>4</div>
    </div>

    <div v-if="colony.name === getMiranda()" class="colony-grid-container">
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div><div class="resource animal" style="margin-top:11px;"></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getMiranda()" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
      <div>2</div>
      <div>3</div>
      <div>3</div>
    </div>

    <div v-if="colony.name === getIo()" class="colony-grid-container">
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div><div class="production-box"><div class="production heat"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getIo()" class="colony-grid-container2">
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>6</div>
      <div>8</div>
      <div>10</div>
      <div>13</div>
    </div>

    <div v-if="colony.name === getLuna()" class="colony-grid-container">
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div><div class="production-box"><div class="production money">2</div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getLuna()" class="colony-grid-container2">
      <div>1</div>
      <div>2</div>
      <div>4</div>
      <div>7</div>
      <div>10</div>
      <div>13</div>
      <div>17</div>
    </div>

    <div v-if="colony.name === getIapetus()" class="colony-grid-container">
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div><div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getIapetus()" class="colony-grid-container2">
      <div>0</div>
      <div>0</div>
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
    </div>

    <div v-if="colony.name === getCeres()" class="colony-grid-container">
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div><div class="production-box"><div class="production steel"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getCeres()" class="colony-grid-container2">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>6</div>
      <div>8</div>
      <div>10</div>
    </div>

    <div v-if="colony.name === getTriton()" class="colony-grid-container">
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
    <div v-if="colony.name === getTriton()" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </div>

    <div v-if="colony.name === getGanymede()" class="colony-grid-container">
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === getGanymede()" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </div>

    <div v-if="colony.name === getCallisto()" class="colony-grid-container">
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getCallisto()" class="colony-grid-container2">
    <div>0</div>
    <div>2</div>
    <div>3</div>
    <div>5</div>
    <div>7</div>
    <div>10</div>
    <div>13</div>
  </div>

  <div v-if="colony.name === getEuropa()" class="colony-grid-container">
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getEuropa()" class="colony-grid-container2">
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
  </div>

  <div v-if="colony.name === getPallas()" class="colony-grid-container">
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div><div class="influence" style="margin-top:5px"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
    <div v-if="colony.name === getPallas()" class="colony-grid-container2">
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>3</div>
  </div>

  <div v-if="colony.name === getMercury()" class="colony-grid-container">
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div><div class="copy-trade-box">Copy Trade</div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getMercury()" class="colony-grid-container2">
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
    <div><div class="production-box mercury-production-box"><div class="production titanium"></div></div></div>
  </div>

  <div v-if="colony.name === getHygiea()" class="colony-grid-container">
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
  <div v-if="colony.name === getHygiea()" class="colony-grid-container2">
    <div><div class="resource money red-outline"></div></div>
    <div><div class="resource money red-outline"></div></div>
    <div><div class="resource heat red-outline"></div></div>
    <div><div class="resource energy red-outline"></div></div>
    <div><div class="resource plant red-outline"></div></div>
    <div><div class="resource steel red-outline"></div></div>
    <div><div class="resource titanium red-outline"></div></div>
  </div>

  <div v-if="colony.name === getTitania()" class="colony-grid-container">
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">5</div></div>
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">3</div></div>
    <div><div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">2</div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getTitania()" class="colony-grid-container2">
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>1</div>
    <div>1</div>
    <div>0</div>
    <div>0</div>
  </div>

  <div v-if="colony.name === getVenus()" class="colony-grid-container" style="margin-top:5px;">
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div><div class="tile venus-tile venus-colony-bonus"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getVenus()" class="colony-grid-container2" style="margin-top:55px;">
    <div>0</div>
    <div>0</div>
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>

  <div v-if="colony.name === getLeavitt()" class="colony-grid-container">
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div><div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getLeavitt()" class="colony-grid-container2">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </div>

  <div v-if="colony.name === getTitan()" class="colony-grid-container">
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
  <div v-if="colony.name === getTitan()" class="colony-grid-container2">
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
  data() {
    return {
      PLUTO: ColonyName.PLUTO,
      GANYMEDE: ColonyName.GANYMEDE,
    };
  },
  methods: {
    getCubeXPosition: (colony: ColonyModel): number => {
      return colony.trackPosition * 56 + 27;
    },
    getColonyXPosition: (index: number): number => {
      return index * 56 + 16;
    },
    getCubeYPosition: (
      colony: ColonyModel,
      isColonyCube = false,
    ): number => {
      const offset = isColonyCube ? 7 : 0;
      switch (colony.name) {
      case ColonyName.IAPETUS:
      case ColonyName.LEAVITT:
        return 181 + offset;
      case ColonyName.VENUS:
        return 186 + offset;
      case ColonyName.PALLAS:
        return 168 + offset;
      case ColonyName.MERCURY:
      case ColonyName.HYGIEA:
        return 144 + offset;
      case ColonyName.EUROPA:
      case ColonyName.MIRANDA:
        return 166 + offset;
      case ColonyName.PLUTO:
        return 165 + offset;
      case ColonyName.LUNA:
        return 163 + offset;
      default:
        return 164 + offset;
      }
    },
    getGanymede: (): string => {
      return ColonyName.GANYMEDE;
    },
    getEuropa: (): string => {
      return ColonyName.EUROPA;
    },
    getCeres: (): string => {
      return ColonyName.CERES;
    },
    getPluto: (): string => {
      return ColonyName.PLUTO;
    },
    getEnceladus: (): string => {
      return ColonyName.ENCELADUS;
    },
    getIo: (): string => {
      return ColonyName.IO;
    },
    getTriton: (): string => {
      return ColonyName.TRITON;
    },
    getTitan: (): string => {
      return ColonyName.TITAN;
    },
    getLuna: (): string => {
      return ColonyName.LUNA;
    },
    getMiranda: (): string => {
      return ColonyName.MIRANDA;
    },
    getCallisto: (): string => {
      return ColonyName.CALLISTO;
    },
    getColonyContentOffset: (colony: ColonyModel): number => {
      if (colony.name === ColonyName.PLUTO || colony.name === ColonyName.MIRANDA) return -12;
      return 0;
    },
    getIapetus: (): string => {
      return ColonyName.IAPETUS;
    },
    getMercury: (): string => {
      return ColonyName.MERCURY;
    },
    getHygiea: (): string => {
      return ColonyName.HYGIEA;
    },
    getTitania: (): string => {
      return ColonyName.TITANIA;
    },
    getVenus: (): string => {
      return ColonyName.VENUS;
    },
    getLeavitt: (): string => {
      return ColonyName.LEAVITT;
    },
    getPallas: (): string => {
      return ColonyName.PALLAS;
    },
  },
});

</script>

