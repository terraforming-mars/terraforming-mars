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
      return classes.join(' ');
    },
    getNameAndIconClasses: function(): string {
      const classes = ['name-and-icon'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getPlayerCorpClasses: function(): string {
      const classes = ['player-corp'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getPlayerStatusAndResClasses: function(): string {
      const classes = ['player-status-and-res'];
      return classes.join(' ');
    },
    getInfoBottomClasses: function(): string {
      const classes = ['player-info-bottom'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getIsActivePlayer: function(): boolean {
      return this.player.color === this.activePlayer.color;
    },
  },
  template: ` 
      <div :class="getClasses()">
        <div class="player-info-top">
            <div :class="getNameAndIconClasses()">
              <div class="player-info-name">{{ player.name }}</div>
              <div class="icon-first-player" v-if="firstForGen && activePlayer.players.length > 1">1st</div>
            </div>
            <div v-if="player.corporationCard !== undefined" :title="player.corporationCard.name" :class="getPlayerCorpClasses()">{{ player.corporationCard.name }}</div>
            <div class="player-discounts-background" />
        </div>
        <div :class="getInfoBottomClasses()">
          <div :class="getPlayerStatusAndResClasses()">
            <player-status :player="player" :activePlayer="activePlayer" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel" :playerIndex="playerIndex"/>
            <player-resources :player="player" v-trim-whitespace />
          </div>
          <player-tags :player="player" v-trim-whitespace :isActivePlayer="getIsActivePlayer()" :hideZeroTags="hideZeroTags" />
        </div>
      </div>
    `,
});
