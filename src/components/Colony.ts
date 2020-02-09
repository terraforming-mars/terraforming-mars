import Vue from "vue";
import { IColony } from '../colonies/Colony';

export const Colony = Vue.component("colony", {
    props: [
        "colony"
    ],
    methods: {
        getCubeXPosition: (colony: IColony): number => {
            return colony.trackPosition * 56 + 26;
        },
        getCubeYPosition: (colony: IColony): number => {
            if (colony.name === 'Europa') return 165;
            return 185;
        },
    },
    template: `
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'">
    <div v-if="colony.isActive" :style="'margin-left:' + getCubeXPosition(colony) + 'px; margin-top:' + getCubeYPosition(colony) + 'px;'" class="colony_cube"></div>
    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>
    <div class="colony-content">
      <div v-if="colony.name === 'Ganymede'" class="resource plant"></div>
      <div v-if="colony.name === 'Europa'" class="resource money">1</div>
      <div v-if="colony.name === 'Titan'" class="resource floater"></div>
      <span class="colony-background-color">
        Colony Bonus
        </span><br>
      <div v-if="colony.name === 'Ganymede'" class="resource plant" style="margin-left:20px;"></div>
      <div v-if="colony.name === 'Titan'" class="resource floater" style="margin-left:20px;"></div>
      <div v-if="colony.name !== 'Europa'" class="white-x"></div>
      <span v-if="colony.name !== 'Europa'" class="colony-background-color">
        Trade Income
      </span>
      <span v-if="colony.name === 'Europa'" class="colony-background-color" style="margin-left: 3px;">
        Trade Income: Gain the indicated production
      </span>

    <div v-if="colony.name === 'Ganymede'" class="colony-grid-container">
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="colony.name === 'Ganymede'" class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </div>

    <div v-if="colony.name === 'Europa'" class="colony-grid-container">
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div><div class="tile ocean-tile ocean-tile-colony"></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === 'Europa'" class="colony-grid-container2">
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production money">1</div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
    <div><div class="production-box"><div class="production plant"></div></div></div>
  </div>

  <div v-if="colony.name === 'Titan'" class="colony-grid-container">
  <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      <div v-if="colony.trackPosition === 0" class="colony_cube"></div>
  </div>
  <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      <div v-if="colony.trackPosition === 1" class="colony_cube"></div>
  </div>
  <div><div class="resource floater resource-stacked " style="positon:absolute;margin-bottom:0px;margin-top:6px;z-index:1;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;"></div>
      <div class="resource floater resource-stacked " style="positon:absolute;margin-top:-20px;margin-left:-5px;"></div>
      <div v-if="colony.trackPosition === 2" class="colony_cube"></div>
  </div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
<div v-if="colony.name === 'Titan'" class="colony-grid-container2">
  <div>0</div>
  <div>1</div>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>3</div>
  <div>4</div>
</div>

    </div>
    `
});