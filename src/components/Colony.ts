import Vue from "vue";

import { ColonyModel } from '../models/ColonyModel';
import { ColonyName } from '../colonies/ColonyName';

export const Colony = Vue.component("colony", {
    props: [
        "player",
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
            if (colony.name === ColonyName.EUROPA) return 145;
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
        }
    },
    template: `
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'" v-i18n>
    <div v-if="colony.visitor !== undefined" class="spaceship">
      <div style="margin-left: 45px;  margin-top: 55px;" :class="'board-cube board-cube--' + colony.visitor"></div>
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

      <span v-if="colony.name === getPluto()" class="white-char" style="margin-left:5px;">+</span>
      <div v-if="colony.name === getPluto()" class="resource card" style="transform: scale(0.8);margin-left:-2px;"></div>
      <span v-if="colony.name === getPluto()" class="white-char">-</span>
      <div v-if="colony.name === getPluto()" class="resource card" style="transform: scale(0.8);margin-left:-2px;"></div>
      
      <span class="colony-background-color">
        Colony Bonus
        </span><br>
      <div v-if="colony.name === getGanymede()" class="resource plant" style="margin-left:20px;"></div>
      <div v-if="colony.name === getTitan()" class="resource floater" style="margin-left:20px;"></div>
      <div v-if="colony.name === getEnceladus()" class="resource microbe" style="margin-left:20px;"></div>
      <div v-if="colony.name === getCallisto()" class="resource energy" style="margin-left:20px;"></div>
      <div v-if="colony.name === getTriton()" class="resource titanium" style="margin-left:20px;"></div>
      <div v-if="colony.name === getCeres()" class="resource steel" style="margin-left:20px;"></div>
      <div v-if="colony.name === getLuna()" class="resource money" style="margin-left:20px;">&nbsp;</div>
      <div v-if="colony.name === getIo()" class="resource heat" style="margin-left:20px;"></div>
      <div v-if="colony.name === getMiranda()" class="resource animal" style="margin-left:20px;margin-top:-10px;"></div>
      <div v-if="colony.name === getPluto()" class="resource card" style="margin-left:20px;transform: scale(0.8);margin-top:-10px;"></div>
      <div v-if="colony.name !== getEuropa()" class="white-x"></div>
      <span v-if="colony.name !== getEuropa()" class="colony-background-color">
        Trade Income
      </span>
      <span v-if="colony.name === getEuropa()" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Gain the indicated production
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
