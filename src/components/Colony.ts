import Vue from "vue";

import { ColonyModel } from '../models/ColonyModel';
import { ColonyName } from '../colonies/ColonyName';

export const Colony = Vue.component("colony", {
    props: [
        "colony"
    ],
    data: function () {
      return {
        PLUTO : ColonyName.PLUTO,
        GANYMEDE: ColonyName.GANYMEDE
      };
    },
    methods: {
        getCubeXPosition: (colony: ColonyModel): number => {
            return colony.trackPosition * 56 + 26;
        },
        getColonyXPosition: (index: number): number => {
            return index * 56 + 26;
        },
        getCubeYPosition: (colony: ColonyModel): number => {
            if (colony.name === ColonyName.IAPETUS) return 185;
            if (colony.name === ColonyName.VENUS) return 180;
            if (colony.name === ColonyName.EUROPA || colony.name === ColonyName.MERCURY || colony.name === ColonyName.HYGIEA) return 145;
            if (colony.name === ColonyName.MIRANDA || colony.name === ColonyName.PLUTO ) return 180;
            return 165;
        },
        getGanymede:(): string => {
          return ColonyName.GANYMEDE;
        },
        getEuropa:(): string => {
          return ColonyName.EUROPA;
        },
        getCeres:(): string => {
          return ColonyName.CERES;
        },
        getPluto:(): string => {
          return ColonyName.PLUTO;
        },
        getEnceladus:(): string => {
          return ColonyName.ENCELADUS;
        },
        getIo:(): string => {
          return ColonyName.IO;
        },
        getTriton:(): string => {
          return ColonyName.TRITON;
        },
        getTitan:(): string => {
          return ColonyName.TITAN;
        },
        getLuna:(): string => {
          return ColonyName.LUNA;
        },
        getMiranda:(): string => {
          return ColonyName.MIRANDA;
        },        
        getCallisto:(): string => {
          return ColonyName.CALLISTO;
        },
        getIapetus:(): string => {
          return ColonyName.IAPETUS;
        },
        getMercury:(): string => {
          return ColonyName.MERCURY;
        },
        getHygiea:(): string => {
          return ColonyName.HYGIEA;
        },
        getTitania:(): string => {
          return ColonyName.TITANIA;
        },
        getVenus:(): string => {
          return ColonyName.VENUS;
        }
    },
    template: `
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'" v-i18n>
    <div v-if="colony.visitor !== undefined" class="colony-spaceship">
      <div :class="'colonies-fleet colonies-fleet-'+ colony.visitor"></div>
    </div>
    <div v-if="colony.isActive" :style="'margin-left:' + getCubeXPosition(colony) + 'px; margin-top:' + getCubeYPosition(colony) + 'px;'" class="colony_cube"></div>
    <div v-if="colony.colonies.length > 0" :style="'margin-left: ' + getColonyXPosition(0) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board-cube board-cube--' + colony.colonies[0]"></div>
    <div v-if="colony.colonies.length > 1" :style="'margin-left: ' + getColonyXPosition(1) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board-cube board-cube--' + colony.colonies[1]"></div>
    <div v-if="colony.colonies.length > 2" :style="'margin-left: ' + getColonyXPosition(2) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board-cube board-cube--' + colony.colonies[2]"></div>

    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>
    <div class="colony-content">
      <div v-if="colony.name === getGanymede()" class="resource plant"></div>
      <div v-if="colony.name === getEuropa()" class="resource money">1</div>
      <div v-if="colony.name === getTitan()" class="resource floater"></div>
      <div v-if="colony.name === getEnceladus()" class="resource microbe"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy"></div>
      <div v-if="colony.name === getTriton()" class="resource titanium"></div>
      <div v-if="colony.name === getMiranda()" style="transform:scale(0.8)" class="resource card"></div>
      <div v-if="colony.name === getCeres()" class="resource steel"></div>
      <div v-if="colony.name === getCeres()" class="resource steel"></div>
      <div v-if="colony.name === getIo()" class="resource heat"></div>
      <div v-if="colony.name === getIo()" class="resource heat"></div>      
      <div v-if="colony.name === getLuna()" class="resource money">2</div>

      <div v-if="colony.name === getIapetus()" class="resource card" style="transform: scale(0.8);"></div>
      <span v-if="colony.name === getIapetus()" class="white-char">:</span>
      <div v-if="colony.name === getIapetus()" class="resource money">-1</div>

      <div v-if="colony.name === getMercury()" class="resource money">2</div>
      <div v-if="colony.name === getHygiea()" class="resource money">3</div>
      <div v-if="colony.name === getTitania()" class="resource money">-3</div>
      <div v-if="colony.name === getVenus()" class="resource" style="background:white;margin:15px 10px 10px 20px;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 16px;">V</div></div>

      <span v-if="colony.name === getPluto()" class="white-char" style="margin-left:5px;">+</span>
      <div v-if="colony.name === getPluto()" class="resource card" style="transform: scale(0.8);margin-left:-2px;"></div>
      <span v-if="colony.name === getPluto()" class="white-char">-</span>
      <div v-if="colony.name === getPluto()" class="resource card" style="transform: scale(0.8);margin-left:-2px;"></div>
      
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
      <div v-if="colony.name === getMiranda()" class="resource animal" style="margin-left:20px;margin-top:-10px;"></div>
      <div v-if="colony.name === getPluto()" class="resource card" style="margin-left:20px;transform: scale(0.8);margin-top:-10px;"></div>
      <div v-if="colony.name !== getEuropa() && colony.name !== getMercury() && colony.name !== getIapetus() && colony.name !== getHygiea() && colony.name !== getTitania() && colony.name !== getVenus()" class="white-x"></div>
      <div v-if="colony.name === getIapetus()" class="white-x" style="margin-left:-42px;"></div>
      <div v-if="colony.name === getTitania()" class="white-x" style="margin-left:42px;"></div>
      <div v-if="colony.name === getTitania()" class="points points-big" style="margin-left: 10px; margin-top: -53px; transform: scale(0.5); height: 50px; width: 50px">&nbsp;</div>
      <div v-if="colony.name === getVenus()" class="white-x" style="margin-left:45px; margin-bottom:4px;"></div>
      <div v-if="colony.name === getVenus()" class="resource" style="background:white;margin:10px 10px 10px -20px;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 16px;">V</div></div>
      <span v-if="colony.name !== getEuropa() && colony.name !== getMercury() && colony.name !== getIapetus() && colony.name !== getHygiea() && colony.name !== getTitania()" class="colony-background-color">
        Trade Income
      </span>
      <span v-if="colony.name === getIapetus()" class="colony-background-color" style="position:relative;top:-8px;left:30px">
        Trade Income
      </span>
      <span v-if="colony.name === getTitania()" class="colony-background-color" style="position:relative;top:-14px;left:12px">
        Trade Income
      </span>
      <span v-if="colony.name === getEuropa() || colony.name === getMercury()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Gain the indicated production
      </span>
      <span v-if="colony.name === getHygiea()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Steal 3 indicated resources
      </span>

    <div v-if="colony.name === getEnceladus()" class="colony-grid-container">
      <div><div class="resource microbe resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      </div>
      <div><div class="resource microbe resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      </div>
      <div><div class="resource microbe resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource microbe resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
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
        <div class="resource card" style="margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
      </div>
      <div>
        <div class="resource card" style="margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
      </div>
      <div>
        <div class="resource card" style="margin-left: -5px; transform: scale(0.8);"></div>
        <div class="resource card" style="position absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
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
      <div><div class="resource titanium resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      </div>
      <div><div class="resource titanium resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      </div>
      <div><div class="resource titanium resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
          <div class="resource titanium resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
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

  <div v-if="colony.name === getMercury()" class="colony-grid-container">
    <div><div class="triangle triangle-black" style="margin: 10px 0 0 3px"></div></div>
    <div><div class="triangle triangle-black" style="margin: 10px 0 0 3px"></div></div>
    <div><div class="triangle triangle-black" style="margin: 10px 0 0 3px"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === getMercury()" class="colony-grid-container2">
    <div><div class="production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box"><div class="production heat"></div></div></div>
    <div><div class="production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box"><div class="production steel"></div></div></div>
    <div><div class="production-box"><div class="production titanium"></div></div></div>
    <div><div class="production-box"><div class="production titanium"></div></div></div>
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
    <div><div class="resource money red-outline" style="margin-top: 16px"></div></div>
    <div><div class="resource money red-outline" style="margin-top: 16px"></div></div>
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
    <div><div class="tile venus-tile" style="transform: scale(0.8); margin-left: 0px">V</div></div>
    <div><div class="tile venus-tile" style="transform: scale(0.8); margin-left: 0px">V</div></div>
    <div><div class="tile venus-tile" style="transform: scale(0.8); margin-left: 0px">V</div></div>
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

  <div v-if="colony.name === getTitan()" class="colony-grid-container">
    <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
    </div>
    <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
    </div>
    <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
        <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
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
    `
});
