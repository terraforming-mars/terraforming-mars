<script lang="ts">
import Vue from 'vue';
import {Color} from '../../Color';
import {BoardName} from '../../boards/BoardName';
import {CardName} from '../../CardName';
import CorporationsFilter from './CorporationsFilter.vue';
import {translateTextWithParams} from '../../directives/i18n';
import {IGameData} from '../../database/IDatabase';
import ColoniesFilter from './ColoniesFilter.vue';
import {ColonyName} from '../../colonies/ColonyName';
import CardsFilter from './CardsFilter.vue';
import Button from '../common/Button.vue';
import {playerColorClass} from '../../utils/utils';
import {RandomMAOptionType} from '../../RandomMAOptionType';
import {GameId} from '../../Game';
import {AgendaStyle} from '../../turmoil/PoliticalAgendas';

import * as constants from '../../constants';
import {$t} from '../../directives/i18n';

export interface CreateGameModel {
    constants: typeof constants;
    allOfficialExpansions: boolean;
    firstIndex: number;
    playersCount: number;
    players: Array<NewPlayerModel>;
    corporateEra: boolean;
    prelude: boolean;
    draftVariant: boolean;
    initialDraft: boolean;
    randomMA: RandomMAOptionType;
    randomFirstPlayer: boolean;
    showOtherPlayersVP: boolean;
    beginnerOption: boolean;
    venusNext: boolean;
    colonies: boolean;
    turmoil: boolean;
    customCorporationsList: Array<CardName>;
    customColoniesList: Array<ColonyName>;
    cardsBlackList: Array<CardName>;
    showCorporationList: boolean;
    showColoniesList: boolean;
    showCardsBlackList: boolean;
    isSoloModePage: boolean;
    board: BoardName | 'random';
    boards: Array<BoardName | 'random'>;
    seed: number;
    solarPhaseOption: boolean;
    shuffleMapOption: boolean;
    promoCardsOption: boolean;
    communityCardsOption: boolean;
    aresExtension: boolean;
    politicalAgendasExtension: AgendaStyle;
    moonExpansion: boolean;
    undoOption: boolean;
    showTimers: boolean;
    fastModeOption: boolean;
    removeNegativeGlobalEventsOption: boolean;
    includeVenusMA: boolean;
    startingCorporations: number;
    soloTR: boolean;
    clonedGameData: IGameData | undefined;
    cloneGameData: Array<IGameData>;
    requiresVenusTrackCompletion: boolean;
    requiresMoonTrackCompletion: boolean;
    seededGame: boolean;
}

export interface NewPlayerModel {
    index: number;
    name: string;
    color: Color;
    beginner: boolean;
    handicap: number;
    first: boolean;
}

export default Vue.extend({
  name: 'CreateGameForm',
  data: function(): CreateGameModel {
    return {
      constants,
      firstIndex: 1,
      playersCount: 1,
      players: [
        {index: 1, name: '', color: Color.RED, beginner: false, handicap: 0, first: false},
        {index: 2, name: '', color: Color.GREEN, beginner: false, handicap: 0, first: false},
        {index: 3, name: '', color: Color.YELLOW, beginner: false, handicap: 0, first: false},
        {index: 4, name: '', color: Color.BLUE, beginner: false, handicap: 0, first: false},
        {index: 5, name: '', color: Color.BLACK, beginner: false, handicap: 0, first: false},
        {index: 6, name: '', color: Color.PURPLE, beginner: false, handicap: 0, first: false},
        {index: 7, name: '', color: Color.ORANGE, beginner: false, handicap: 0, first: false},
        {index: 8, name: '', color: Color.PINK, beginner: false, handicap: 0, first: false},
      ],
      corporateEra: true,
      prelude: false,
      draftVariant: true,
      initialDraft: false,
      randomMA: RandomMAOptionType.NONE,
      randomFirstPlayer: true,
      showOtherPlayersVP: false,
      beginnerOption: false,
      venusNext: false,
      colonies: false,
      showColoniesList: false,
      showCorporationList: false,
      showCardsBlackList: false,
      turmoil: false,
      customCorporationsList: [],
      customColoniesList: [],
      cardsBlackList: [],
      isSoloModePage: false,
      board: BoardName.ORIGINAL,
      boards: [
        BoardName.ORIGINAL,
        BoardName.HELLAS,
        BoardName.ELYSIUM,
        'random',
      ],
      seed: Math.random(),
      seededGame: false,
      solarPhaseOption: false,
      shuffleMapOption: false,
      promoCardsOption: false,
      communityCardsOption: false,
      aresExtension: false,
      politicalAgendasExtension: AgendaStyle.STANDARD,
      moonExpansion: false,
      undoOption: false,
      showTimers: true,
      fastModeOption: false,
      removeNegativeGlobalEventsOption: false,
      includeVenusMA: true,
      startingCorporations: 2,
      soloTR: false,
      clonedGameData: undefined,
      cloneGameData: [],
      allOfficialExpansions: false,
      requiresVenusTrackCompletion: false,
      requiresMoonTrackCompletion: false,
    };
  },
  components: {
    Button,
    CardsFilter,
    ColoniesFilter,
    CorporationsFilter,
  },
  mounted: function() {
    if (window.location.pathname === '/solo') {
      this.isSoloModePage = true;
    }

    const onSucces = (response: any) => {
      this.$data.cloneGameData = response;
    };

    fetch('/api/clonablegames')
      .then((response) => response.json())
      .then(onSucces)
      .catch((_) => alert('Unexpected server response'));
  },
  methods: {
    downloadCurrentSettings: function() {
      const serializedData = this.serializeSettings();

      if (serializedData) {
        const a = document.createElement('a');
        const blob = new Blob([serializedData], {'type': 'application/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'tm_settings.json';
        a.click();
      }
    },
    handleSettingsUpload: function() {
      const refs = this.$refs;
      const file = (refs.file as any).files[0];
      const reader = new FileReader();
      const component = this.$data;

      reader.addEventListener('load', function() {
        const readerResults = reader.result;
        if (typeof(readerResults) === 'string') {
          const results = JSON.parse(readerResults);
          const players = results['players'];
          component.playersCount = players.length;
          component.showCorporationList = results['customCorporationsList'].length > 0;
          component.showColoniesList = results['customColoniesList'].length > 0;
          component.showCardsBlackList = results['cardsBlackList'].length > 0;

          for (const k in results) {
            if (['customCorporationsList', 'customColoniesList', 'cardsBlackList', 'players'].includes(k)) continue;
            (component as any)[k] = results[k];
          }

          for (let i = 0; i < players.length; i++) {
            component.players[i] = players[i];
          }

          Vue.nextTick(() => {
            if (component.showColoniesList) {
              (refs.coloniesFilter as any).updateColoniesByNames(results['customColoniesList']);
            }

            if (component.showCorporationList) {
              (refs.corporationsFilter as any).selectedCorporations = results['customCorporationsList'];
            }

            if (component.showCardsBlackList) {
              (refs.cardsFilter as any).selectedCardNames = results['cardsBlackList'];
            }

            if ( ! component.seededGame) {
              component.seed = Math.random();
            }
          });
        }
      }, false);
      if (file) {
        if (/\.json$/i.test(file.name)) {
          reader.readAsText(file);
        }
      }
    },
    getPlayerNamePlaceholder: function(player: NewPlayerModel): string {
      return translateTextWithParams(
        'Player ${0} name',
        [String(player.index)],
      );
    },
    updateCustomCorporationsList: function(newCustomCorporationsList: Array<CardName>) {
      const component = (this as any) as CreateGameModel;
      component.customCorporationsList = newCustomCorporationsList;
    },
    updateCardsBlackList: function(newCardsBlackList: Array<CardName>) {
      const component = (this as any) as CreateGameModel;
      component.cardsBlackList = newCardsBlackList;
    },
    updateCustomColoniesList: function(newCustomColoniesList: Array<ColonyName>) {
      const component = (this as any) as CreateGameModel;
      component.customColoniesList = newCustomColoniesList;
    },
    getPlayers: function(): Array<NewPlayerModel> {
      const component = (this as any) as CreateGameModel;
      return component.players.slice(0, component.playersCount);
    },
    isRandomMAEnabled: function(): Boolean {
      return this.randomMA !== RandomMAOptionType.NONE;
    },
    randomMAToggle: function() {
      const component = (this as any) as CreateGameModel;
      if (component.randomMA === RandomMAOptionType.NONE) {
        component.randomMA = RandomMAOptionType.LIMITED;
        this.randomMA = RandomMAOptionType.LIMITED;
      } else {
        component.randomMA = RandomMAOptionType.NONE;
        this.randomMA = RandomMAOptionType.NONE;
      }
    },
    getRandomMaOptionType: function(type: 'limited' | 'full'): RandomMAOptionType {
      if (type === 'limited') {
        return RandomMAOptionType.LIMITED;
      } else if (type === 'full') {
        return RandomMAOptionType.UNLIMITED;
      } else {
        return RandomMAOptionType.NONE;
      }
    },
    isPoliticalAgendasExtensionEnabled: function(): Boolean {
      return this.politicalAgendasExtension !== AgendaStyle.STANDARD;
    },
    politicalAgendasExtensionToggle: function() {
      if (this.politicalAgendasExtension === AgendaStyle.STANDARD) {
        this.politicalAgendasExtension = AgendaStyle.RANDOM;
      } else {
        this.politicalAgendasExtension = AgendaStyle.STANDARD;
      }
    },
    getPoliticalAgendasExtensionAgendaStyle: function(type: 'random' | 'chairman'): AgendaStyle {
      if (type === 'random') {
        return AgendaStyle.RANDOM;
      } else if (type === 'chairman') {
        return AgendaStyle.CHAIRMAN;
      } else {
        console.warn('AgendaStyle not found');
        return AgendaStyle.STANDARD;
      }
    },
    isBeginnerToggleEnabled: function(): Boolean {
      return !(this.initialDraft || this.prelude || this.venusNext || this.colonies || this.turmoil);
    },
    selectAll: function() {
      this.corporateEra = this.$data.allOfficialExpansions;
      this.prelude = this.$data.allOfficialExpansions;
      this.venusNext = this.$data.allOfficialExpansions;
      this.colonies = this.$data.allOfficialExpansions;
      this.turmoil = this.$data.allOfficialExpansions;
      this.promoCardsOption = this.$data.allOfficialExpansions;
      this.solarPhaseOption = this.$data.allOfficialExpansions;
    },
    toggleVenusNext: function() {
      this.solarPhaseOption = this.$data.venusNext;
    },
    deselectPoliticalAgendasWhenDeselectingTurmoil: function() {
      if (this.$data.turmoil === false) {
        this.politicalAgendasExtension = AgendaStyle.STANDARD;
      }
    },
    deselectVenusCompletion: function() {
      if (this.$data.venusNext === false) {
        this.requiresVenusTrackCompletion = false;
      }
    },
    deselectMoonCompletion: function() {
      if (this.$data.moonExpansion === false) {
        this.requiresMoonTrackCompletion = false;
      }
    },
    getBoardColorClass: function(boardName: string): string {
      if (boardName === BoardName.ORIGINAL) {
        return 'create-game-board-hexagon create-game-tharsis';
      } else if (boardName === BoardName.HELLAS) {
        return 'create-game-board-hexagon create-game-hellas';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'create-game-board-hexagon create-game-elysium';
      } else {
        return 'create-game-board-hexagon create-game-random';
      }
    },
    getPlayerCubeColorClass: function(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg');
    },
    getPlayerContainerColorClass: function(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg_transparent');
    },
    serializeSettings: function() {
      const component = (this as any) as CreateGameModel;

      let players = component.players.slice(0, component.playersCount);

      if (component.randomFirstPlayer) {
        // Shuffle players array to assign each player a random seat around the table
        players = players.map((a) => ({sort: Math.random(), value: a}))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);
        component.firstIndex = Math.floor(component.seed * component.playersCount) + 1;
      }

      // Auto assign an available color if there are duplicates
      const uniqueColors = players.map((player) => player.color).filter((v, i, a) => a.indexOf(v) === i);
      if (uniqueColors.length !== players.length) {
        const allColors = [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN, Color.BLACK, Color.PURPLE, Color.ORANGE, Color.PINK];
        players.forEach((player) => {
          if (allColors.includes(player.color)) {
            allColors.splice(allColors.indexOf(player.color), 1);
          } else {
            player.color = allColors.shift() as Color;
          }
        });
      }

      // Set player name automatically if not entered
      const isSoloMode = component.playersCount === 1;

      component.players.forEach((player) => {
        if (player.name === '') {
          if (isSoloMode) {
            player.name = 'You';
          } else {
            const defaultPlayerName = player.color.charAt(0).toUpperCase() + player.color.slice(1);
            player.name = defaultPlayerName;
          }
        }
      });

      players.map((player: any) => {
        player.first = (component.firstIndex === player.index);
        return player;
      });

      const corporateEra = component.corporateEra;
      const prelude = component.prelude;
      const draftVariant = component.draftVariant;
      const initialDraft = component.initialDraft;
      const randomMA = component.randomMA;
      const showOtherPlayersVP = component.showOtherPlayersVP;
      const venusNext = component.venusNext;
      const colonies = component.colonies;
      const turmoil = component.turmoil;
      const solarPhaseOption = this.solarPhaseOption;
      const shuffleMapOption = this.shuffleMapOption;
      const customCorporationsList = component.customCorporationsList;
      const customColoniesList = component.customColoniesList;
      const cardsBlackList = component.cardsBlackList;
      const board = component.board;
      const seed = component.seed;
      const promoCardsOption = component.promoCardsOption;
      const communityCardsOption = component.communityCardsOption;
      const aresExtension = component.aresExtension;
      const politicalAgendasExtension = this.politicalAgendasExtension;
      const moonExpansion = component.moonExpansion;
      const undoOption = component.undoOption;
      const showTimers = component.showTimers;
      const fastModeOption = component.fastModeOption;
      const removeNegativeGlobalEventsOption = this.removeNegativeGlobalEventsOption;
      const includeVenusMA = component.includeVenusMA;
      const startingCorporations = component.startingCorporations;
      const soloTR = component.soloTR;
      const beginnerOption = component.beginnerOption;
      const randomFirstPlayer = component.randomFirstPlayer;
      const requiresVenusTrackCompletion = component.requiresVenusTrackCompletion;
      const requiresMoonTrackCompletion = component.requiresMoonTrackCompletion;
      let clonedGamedId: undefined | GameId = undefined;

      // Check custom colony count
      if (customColoniesList.length > 0) {
        const playersCount = players.length;
        let neededColoniesCount = playersCount + 2;
        if (playersCount === 1) {
          neededColoniesCount = 4;
        } else if (playersCount === 2) {
          neededColoniesCount = 5;
        }

        if (customColoniesList.length < neededColoniesCount) {
          window.alert(translateTextWithParams('Must select at least ${0} colonies', [neededColoniesCount.toString()]));
          return;
        }
      }

      // Check custom corp count
      if (customCorporationsList.length > 0) {
        const neededCorpsCount = players.length * startingCorporations;

        if (customCorporationsList.length < neededCorpsCount) {
          window.alert(translateTextWithParams('Must select at least ${0} corporations', [neededCorpsCount.toString()]));
          return;
        }
      }

      // Clone game checks
      if (component.clonedGameData !== undefined && component.seededGame) {
        clonedGamedId = component.clonedGameData.gameId;
        if (component.clonedGameData.playerCount !== players.length) {
          window.alert($t('Player count mismatch'));
          this.$data.playersCount = component.clonedGameData.playerCount;
          return;
        }
      } else if (!component.seededGame) {
        clonedGamedId = undefined;
      }

      const dataToSend = JSON.stringify({
        players,
        corporateEra,
        prelude,
        draftVariant,
        showOtherPlayersVP,
        venusNext,
        colonies,
        turmoil,
        customCorporationsList,
        customColoniesList,
        cardsBlackList,
        board,
        seed,
        solarPhaseOption,
        promoCardsOption,
        communityCardsOption,
        aresExtension: aresExtension,
        politicalAgendasExtension: politicalAgendasExtension,
        moonExpansion: moonExpansion,
        undoOption,
        showTimers,
        fastModeOption,
        removeNegativeGlobalEventsOption,
        includeVenusMA,
        startingCorporations,
        soloTR,
        clonedGamedId,
        initialDraft,
        randomMA,
        shuffleMapOption,
        beginnerOption,
        randomFirstPlayer,
        requiresVenusTrackCompletion,
        requiresMoonTrackCompletion,
      }, undefined, 4);
      return dataToSend;
    },
    createGame: function() {
      const dataToSend = this.serializeSettings();

      if (dataToSend === undefined) return;
      const onSucces = (response: any) => {
        if (response.players.length === 1) {
          window.location.href = '/player?id=' + response.players[0].id;
          return;
        } else {
          window.history.replaceState(response, `${constants.APP_NAME} - Game`, '/game?id=' + response.id);
          (this as any).$root.$data.game = response;
          (this as any).$root.$data.screen = 'game-home';
        }
      };

      fetch('/game', {'method': 'PUT', 'body': dataToSend, 'headers': {'Content-Type': 'application/json'}})
        .then((response) => response.json())
        .then(onSucces)
        .catch((_) => alert('Unexpected server response'));
    },
  },
});
</script>
