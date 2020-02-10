import Vue from "vue";
import { IColony } from '../colonies/Colony';
import { Player } from '../Player';

export const Colony = Vue.component("colony", {
    props: [
        "player",
        "colony"
    ],
    methods: {
        getCubeXPosition: (colony: IColony): number => {
            return colony.trackPosition * 56 + 26;
        },
        getColonyXPosition: (index: number): number => {
            return index * 56 + 26;
        },
        getCubeYPosition: (colony: IColony): number => {
            if (colony.name === 'Europa') return 165;
            return 185;
        },
        getColonyPlayers: (colony: IColony): Array<Player>=> {
          return colony.colonies;
        },
        getPlayerColor:(player: Player): string => {
          return player.color;
        }
    },
    template: `
    <div class="filterDiv colony-card colonies" :class="colony.name + '-background'">
    <div v-if="colony.isVisited !== undefined" class="spaceship">
      <div style="margin-left: 45px;  margin-top: 55px;" :class="'board_cube board_cube--' + getPlayerColor(colony.isVisited)"></div>
    </div>
    <div v-if="colony.isActive" :style="'margin-left:' + getCubeXPosition(colony) + 'px; margin-top:' + getCubeYPosition(colony) + 'px;'" class="colony_cube"></div>
    <div v-if="colony.colonies.length > 0" :style="'margin-left: ' + getColonyXPosition(0) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board_cube board_cube--' + getPlayerColor(colony.colonies[0])"></div>
    <div v-if="colony.colonies.length > 1" :style="'margin-left: ' + getColonyXPosition(1) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board_cube board_cube--' + getPlayerColor(colony.colonies[1])"></div>
    <div v-if="colony.colonies.length > 2" :style="'margin-left: ' + getColonyXPosition(2) + 'px;  margin-top:' + getCubeYPosition(colony) + 'px;'" :class="'board_cube board_cube--' + getPlayerColor(colony.colonies[2])"></div>

    <div class="colony-card-title-div">
      <span class="colony-card-title-span" :class="colony.name + '-title'">{{colony.name}}</span>
    </div>
    <div class="colony-content">
      <div v-if="colony.name === 'Ganymede'" class="resource plant"></div>
      <div v-if="colony.name === 'Europa'" class="resource money">1</div>
      <div v-if="colony.name === 'Titan'" class="resource floater"></div>
      <div v-if="colony.name === 'Callisto'" class="resource energy"></div>
      <span class="colony-background-color">
        Colony Bonus
        </span><br>
      <div v-if="colony.name === 'Ganymede'" class="resource plant" style="margin-left:20px;"></div>
      <div v-if="colony.name === 'Titan'" class="resource floater" style="margin-left:20px;"></div>
      <div v-if="colony.name === 'Callisto'" class="resource energy" style="margin-left:20px;"></div>
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

    <div v-if="colony.name === 'Callisto'" class="colony-grid-container">
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div><div class="production-box"><div class="production energy"></div></div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div v-if="colony.name === 'Callisto'" class="colony-grid-container2">
    <div>0</div>
    <div>2</div>
    <div>3</div>
    <div>5</div>
    <div>7</div>
    <div>10</div>
    <div>13</div>
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