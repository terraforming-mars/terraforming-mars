import Vue from 'vue';
import {PlayerModel} from '../../models/PlayerModel';
import {PlayerResources} from './PlayerResources';
import {PlayerTags} from './PlayerTags';
import {PlayerStatus} from './PlayerStatus';
import {playerColorClass} from '../../utils/utils';

export const PlayerInfo = Vue.component('player-info', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    activePlayer: {
      type: Object as () => PlayerModel,
    },
    firstForGen: {
      type: Boolean,
    },
    actionLabel: {
      type: String,
    },
    playerIndex: {
      type: Number,
    },
    hideZeroTags: {
      type: Boolean,
    },
  },
  components: {
    'player-resources': PlayerResources,
    'player-tags': PlayerTags,
    'player-status': PlayerStatus,
  },
  methods: {
    getClasses: function(): string {
      const classes = ['player-info'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getPlayerStatusAndResClasses: function(): string {
      const classes = ['player-status-and-res'];
      return classes.join(' ');
    },
    getIsActivePlayer: function(): boolean {
      return this.player.color === this.activePlayer.color;
    },
  },
  template: ` 
        <div :class="getClasses()">
            <div :class="getPlayerStatusAndResClasses()">
                <player-status :player="player" :activePlayer="activePlayer" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel" :playerIndex="playerIndex"/>
                <player-resources :player="player" v-trim-whitespace />
            </div>
            <player-tags :player="player" v-trim-whitespace :isActivePlayer="getIsActivePlayer()" :hideZeroTags="hideZeroTags" />
        </div>
    `,
});
