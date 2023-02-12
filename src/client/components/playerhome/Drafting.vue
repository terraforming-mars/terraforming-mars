<template>
  <div class="player_home_block player_home_block--setup nofloat"  v-if="thisPlayer.tableau.length === 0">
    <template v-if="isCorporationDraftingPhase()">
      <div>
        <dynamic-title title="Corporations To Draft" :color="thisPlayer.color"/>
        <div v-for="card in game.corporationsToDraft" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>
      <br/>
      <br/>
      <div>
        <dynamic-title title="Your Picked Corporations" :color="thisPlayer.color"/>
        <div v-for="card in playerView.draftedCorporations" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>
      <div>
        <dynamic-title title="Your cards" :color="thisPlayer.color" v-if="isCorporationDraftingPhase()"/>
        <div v-for="card in playerView.dealtPreludeCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
        <div v-for="card in playerView.dealtCeoCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
        <div v-for="card in playerView.dealtProjectCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>
    </template>

    <template v-if="isInitialDraftingPhase()">
      <div v-for="card in playerView.dealtCorporationCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>

      <div v-for="card in playerView.dealtPreludeCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>

      <div v-for="card in playerView.dealtCeoCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>

      <div v-for="card in playerView.dealtProjectCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>
    </template>
    <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
      <dynamic-title title="Drafted Cards" :color="thisPlayer.color"/>
      <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
      </div>
    </div>

    <template v-if="playerView.pickedCorporationCard.length === 1">
      <dynamic-title title="Your selected cards:" :color="thisPlayer.color"/>
      <div>
        <div class="cardbox">
          <Card :card="playerView.pickedCorporationCard[0]"/>
        </div>
        <template v-if="game.gameOptions.preludeExtension">
          <div v-for="card in playerView.preludeCardsInHand" :key="card.name" class="cardbox">
            <Card :card="card"/>
          </div>
        </template>
        <template v-if="game.gameOptions.ceoExtension">
          <div v-for="card in playerView.ceoCardsInHand" :key="card.name" class="cardbox">
          <Card :card="card"/>
          </div>
        </template>
      </div>
      <div>
        <div v-for="card in playerView.cardsInHand" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>
    </template>

    <dynamic-title v-if="playerView.pickedCorporationCard.length === 0" title="Select initial cards:" :color="thisPlayer.color"/>
    <WaitingFor v-if="game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor" />

    <dynamic-title title="Game details" :color="thisPlayer.color"/>

    <div class="player_home_block" v-if="playerView.players.length > 1">
      <Milestones :showScores="false" :milestones="game.milestones" />
      <Awards :awards="game.awards" />
    </div>

    <div class="player_home_block player_home_block--turnorder nofloat" v-if="playerView.players.length>1">
      <dynamic-title title="Turn order" :color="thisPlayer.color"/>
      <div class="player_item" v-for="(p, idx) in playerView.players" :key="idx" v-trim-whitespace>
        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
          <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
        </div>
        <div class="player_separator" v-if="idx !== playerView.players.length - 1">⟶</div>
      </div>
    </div>

    <details class="accordion board-accordion" open>
      <summary class="accordion-header">
        <div class="is-action">
          <i class="icon icon-arrow-right mr-1"></i>
          <span v-i18n>Board</span>
        </div>
      </summary>
      <div class="accordion-body">
        <Board
          :spaces="game.spaces"
          :venusNextExtension="game.gameOptions.venusNextExtension"
          :venusScaleLevel="game.venusScaleLevel"
          :boardName ="game.gameOptions.boardName"
          :aresExtension="game.gameOptions.aresExtension"
          :pathfindersExpansion="game.gameOptions.pathfindersExpansion"
          :aresData="game.aresData"
          :altVenusBoard="game.gameOptions.altVenusBoard" />

        <Turmoil v-if="game.turmoil" :turmoil="game.turmoil" />

        <a name="moonBoard" class="player_home_anchor"></a>
        <MoonBoard v-if="game.gameOptions.moonExpansion" :model="game.moon" :tileView="tileView"></MoonBoard>
      </div>
    </details>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import Board from '@/client/components/Board.vue';
import Card from '@/client/components/card/Card.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import {PlayerMixin} from '@/client/mixins/PlayerMixin';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';
import {playerColorClass} from '@/common/utils/utils';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import {Phase} from '@/common/Phase';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {TileView} from '../board/TileView';

import * as raw_settings from '@/genfiles/settings.json';

export interface PlayerHomeModel {
  tileView: TileView;
}

export default Vue.extend({
  name: 'player-home',
  data(): PlayerHomeModel {
    return {
      tileView: 'show',
    };
  },
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    game(): GameModel {
      return this.playerView.game;
    },
  },

  components: {
    Board,
    DynamicTitle,
    Card,
    WaitingFor,
    Milestones,
    Awards,
    Turmoil,
    MoonBoard,
  },
  mixins: [PlayerMixin],
  methods: {
    ...PlayerMixin.methods,
    getPlayerCssForTurnOrder: (
      player: PublicPlayerModel,
      highlightActive: boolean,
    ): string => {
      const classes = ['highlighter_box'];
      if (highlightActive) {
        if (player.needsToDraft || (player.needsToDraft === undefined && player.isActive)) {
          classes.push('player_is_active');
        }
        classes.push(playerColorClass(player.color, 'bg'));
      }
      return classes.join(' ');
    },
    isInitialDraftingPhase(): boolean {
      return (this.game.phase === Phase.INITIALDRAFTING) && this.game.gameOptions.initialDraftVariant;
    },
    isCorporationDraftingPhase(): boolean {
      return (this.game.phase === Phase.CORPORATIONDRAFTING) && this.game.gameOptions.corporationsDraft;
    },
  },
});

</script>
