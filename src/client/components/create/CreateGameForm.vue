<template>
  <div id="create-game">
    <h1><span v-i18n>{{ constants.APP_NAME }}</span> — <span v-i18n>Create New Game</span></h1>
    <div class="create-game-discord-invite" v-if="playersCount===1">
      (<span v-i18n>Looking for people to play with</span>? <a href="https://discord.gg/VR8TbrD" class="tooltip" target="_blank"><u v-i18n>Join us on Discord</u></a>.)
    </div>

    <div class="create-game-form create-game-panel create-game--block">

      <div class="create-game-options">

        <div v-if="isSoloModePage">
          <div class="create-game-solo-player form-group" v-for="newPlayer in getPlayers()" v-bind:key="newPlayer.index">
            <div>
              <input class="form-input form-inline create-game-player-name" placeholder="Your name" v-model="newPlayer.name" />
            </div>
            <div class="create-game-colors-wrapper">
              <label class="form-label form-inline create-game-color-label" v-i18n>Color:</label>
              <span class="create-game-colors-cont">
                <label class="form-radio form-inline create-game-color" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple', 'Orange', 'Pink']" v-bind:key="color">
                  <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                  <i class="form-icon"></i> <div :class="'board-cube board-cube--'+color.toLowerCase()"></div>
                </label>
              </span>
            </div>
            <div>
              <CreateGameToggle v-model="newPlayer.beginner" title="Beginner?" class="form-switch form-inline">
                <template #prepend>
                  <i class="form-icon" />
                </template>
              </CreateGameToggle>
            </div>
          </div>
        </div>
        <div class="create-game-page-container">
          <div class="create-game-page-column" v-if="! isSoloModePage">
            <h4 v-i18n>№ of Players</h4>
            <template v-for="pCount in [1,2,3,4,5,6]">
              <div v-bind:key="pCount">
                <input type="radio" :value="pCount" name="playersCount" v-model="playersCount" :id="pCount+'-radio'">
                <label :for="pCount+'-radio'">
                  <span v-html="pCount === 1 ? 'Solo' : pCount"></span>
                </label>
              </div>
            </template>
          </div>

          <div class="create-game-page-column">
            <h4 v-i18n>Expansions</h4>

            <CreateGameToggle v-model="allOfficialExpansions" title="All" />

            <CreateGameToggle v-model="corporateEra" title="Corporate Era" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-CE" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="prelude" title="Prelude" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-prelude" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="venusNext" title="Venus Next" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-venus" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="colonies" title="Colonies" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-colony" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="turmoil" title="Turmoil" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-turmoil" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="promoCardsOption" title="Promos" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-promo" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#promo-cards" />
              </template>
            </CreateGameToggle>

            <div class="create-game-subsection-label" v-i18n>Fan-made</div>

            <CreateGameToggle v-model="aresExtension" title="Ares" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-ares" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Ares" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="communityCardsOption" title="Community" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-community" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#community" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="moonExpansion" title="The Moon" class="expansion-button">
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-themoon" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/The-Moon" />
              </template>
            </CreateGameToggle>

            <template v-if="moonExpansion">
              <CreateGameToggle v-model="requiresMoonTrackCompletion" title="Mandatory Moon Terraforming" />

              <CreateGameToggle v-model="moonStandardProjectVariant" title="Standard Project Variant" >
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#moon-standard-project-variant" />
                </template>
              </CreateGameToggle>
            </template>

            <template v-if="turmoil">
              <CreateGameToggle v-model="isPoliticalAgendasExtensionEnabled" title="Agendas" class="expansion-button">
                <template #prepend>
                  <i class="create-game-expansion-icon expansion-icon-agendas"/>
                </template>
                <template #append>
                  <Tooltip link="https://www.notion.so/Political-Agendas-8c6b0b018a884692be29b3ef44b340a9" />
                </template>
              </CreateGameToggle>

              <div class="create-game-page-column-row" v-if="isPoliticalAgendasExtensionEnabled">
                <div>
                  <input type="radio" name="agendaStyle" v-model="politicalAgendasExtension" :value="maps.AgendaStyle.RANDOM" id="randomAgendaStyle-radio">
                  <label class="label-agendaStyle agendaStyle-random" for="randomAgendaStyle-radio">
                    <span class="agendas-text" v-i18n>{{ maps.AgendaStyle.RANDOM }}</span>
                  </label>
                </div>

                <div>
                  <input type="radio" name="agendaStyle" v-model="politicalAgendasExtension" :value="maps.AgendaStyle.CHAIRMAN" id="chairmanAgendaStyle-radio">
                  <label class="label-agendaStyle agendaStyle-chairman" for="chairmanAgendaStyle-radio">
                    <span class="agendas-text" v-i18n>{{ maps.AgendaStyle.CHAIRMAN }}</span>
                  </label>
                </div>
              </div>
            </template>

            <CreateGameToggle
              v-model="pathfindersExpansion"
              title="Pathfinders"
              class="expansion-button"
            >
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-pathfinders" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Pathfinders"/>
              </template>
            </CreateGameToggle>

            <template v-if="venusNext">
              <CreateGameToggle v-model="altVenusBoard" title="Alternate Venus Board">
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#alt-venus" />
                </template>
              </CreateGameToggle>
            </template>
          </div>

          <div class="create-game-page-column">
            <h4 v-i18n>Board</h4>

            <template v-for="boardName in boards">
              <div v-bind:key="boardName" class="expansion-button">
                <div v-if="boardName === 'arabia terra'" class="create-game-subsection-label" v-i18n>Fan-made</div>
                <input type="radio" :value="boardName" name="board" v-model="board" :id="boardName + '-checkbox'">
                <label :for="boardName + '-checkbox'" class="expansion-button">
                  <span :class="getBoardColorClass(boardName)">&#x2B22;</span><span class="capitalized" v-i18n>{{ boardName }}</span>
                </label>
              </div>
            </template>
          </div>

          <div class="create-game-page-column">
            <h4 v-i18n>Options</h4>

            <label for="startingCorpNum-checkbox">
              <input type="number" class="create-game-corporations-count" value="2" min="1" :max="6" v-model="startingCorporations" id="startingCorpNum-checkbox">
              <span v-i18n>Starting Corporations</span>
            </label>

            <CreateGameToggle v-model="solarPhaseOption" title="World Government Terraforming">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#solar-phase" />
              </template>
            </CreateGameToggle>

            <template v-if="playersCount === 1">
              <CreateGameToggle v-model="soloTR" title="63 TR solo mode">
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#tr-solo-mode" />
                </template>
              </CreateGameToggle>
            </template>

            <CreateGameToggle v-model="undoOption" title="Allow undo">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#allow-undo" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="showTimers" title="Show timers" />

            <CreateGameToggle
              v-model="escapeVelocityMode"
              title="Escape Velocity"
            >
              <template #prepend>
                <i class="create-game-expansion-icon expansion-icon-escape-velocity" />
              </template>
              <template #append>
                <Tooltip link="https://github.com/terraforming-mars/terraforming-mars/wiki/Escape-Velocity"/>
              </template>
            </CreateGameToggle>


            <label for="escapeThreshold-checkbox" v-show="escapeVelocityMode">
              <span v-i18n>After&nbsp;</span>
              <input type="number" class="create-game-corporations-count" value="30" step="5" min="0" :max="180" v-model="escapeVelocityThreshold" id="escapeThreshold-checkbox">
              <span v-i18n>&nbsp;min</span>
            </label>

            <label for="escapePeriod-checkbox-penalty" v-show="escapeVelocityMode">
              <span v-i18n>Reduce&nbsp;</span>
              <input type="number" class="create-game-corporations-count" value="1" min="1" :max="10" v-model="escapeVelocityPenalty" id="escapePeriod-checkbox-penalty">
              <span v-i18n>&nbsp;VP every&nbsp;</span>
              <input type="number" class="create-game-corporations-count" value="2" min="1" :max="10" v-model="escapeVelocityPeriod" id="escapePeriod-checkbox-period">
              <span v-i18n>&nbsp;min</span>
            </label>

            <CreateGameToggle
              v-model="shuffleMapOption"
              title="Randomize board tiles"
            >
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#randomize-board-tiles"/>
              </template>
            </CreateGameToggle>

            <CreateGameToggle
              v-model="seededGame"
              title="Set Predefined Game"
            >
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#set-predefined-game"/>
              </template>
            </CreateGameToggle>

            <div v-if="seededGame">
              <select name="clonedGamedId" v-model="clonedGameData">
                <option v-for="game in cloneGameData" :value="game" :key="game.gameId">
                  {{ game.gameId }} - {{ game.playerCount }} player(s)
                </option>
              </select>
            </div>


            <div class="create-game-subsection-label" v-i18n>Filter</div>

            <CreateGameToggle v-model="showCorporationList" title="Custom Corporation list" />

            <CreateGameToggle v-model="showCardsBlackList" title="Exclude some cards" />

            <template v-if="colonies">
              <CreateGameToggle
                v-model="showColoniesList"
                title="Custom Colonies list"
              />
            </template>

            <template v-if="turmoil">
              <CreateGameToggle
                v-model="removeNegativeGlobalEventsOption"
                title="Remove negative Global Events"
              >
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#remove-negative-global-events"/>
                </template>
              </CreateGameToggle>
            </template>

          </div>


          <div class="create-game-page-column" v-if="playersCount > 1">
            <h4 v-i18n>Multiplayer Options</h4>

            <div class="create-game-page-column-row">
              <CreateGameToggle title="Draft variant" v-model="draftVariant" />

              <CreateGameToggle title="Draft variant" v-model="draftVariant" >
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#initial-draft" />
                </template>
              </CreateGameToggle>
            </div>


            <CreateGameToggle title="Random first player" v-model="randomFirstPlayer" />

            <CreateGameToggle title="Random Milestones/Awards" v-model="isRandomMAEnabled">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#random-milestones-and-awards" />
              </template>
            </CreateGameToggle>


            <CreateGameToggle v-model="requiresVenusTrackCompletion" title="Mandatory Venus Terraforming">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#venus-terraforming" />
              </template>
            </CreateGameToggle>

            <div class="create-game-page-column-row" v-if="isRandomMAEnabled">
              <div>
                <input type="radio" name="randomMAOption" v-model="randomMA" :value="maps.RandomMAOptionType.LIMITED" id="limitedRandomMA-radio">
                <label class="label-randomMAOption" for="limitedRandomMA-radio">
                  <span v-i18n>{{ maps.RandomMAOptionType.LIMITED }}</span>
                </label>
              </div>

              <div>
                <input type="radio" name="randomMAOption" v-model="randomMA" :value="maps.RandomMAOptionType.UNLIMITED" id="unlimitedRandomMA-radio">
                <label class="label-randomMAOption" for="unlimitedRandomMA-radio">
                  <span v-i18n>{{ maps.RandomMAOptionType.UNLIMITED }}</span>
                </label>
              </div>
            </div>

            <template v-if="venusNext">
              <CreateGameToggle v-model="includeVenusMA" title="venusMA-checkbox" />

              <CreateGameToggle v-model="requiresVenusTrackCompletion" title="Mandatory Venus Terraforming">
                <template #append>
                  <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#venus-terraforming" />
                </template>
              </CreateGameToggle>

            </template>

            <CreateGameToggle v-model="showOtherPlayersVP" title="Show real-time VP">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#show-real-time-vp" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="fastModeOption" title="Fast Mode">
              <template #append>
                <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#fast-mode" />
              </template>
            </CreateGameToggle>

            <CreateGameToggle v-model="beginnerOption" title="Beginner Options" />
          </div>

          <div class="create-game-players-cont" v-if="playersCount > 1">
            <div class="container">
              <div class="columns">
                <template v-for="newPlayer in getPlayers()">
                  <div v-bind:key="newPlayer.index">
                    <div :class="'form-group col6 create-game-player '+getPlayerContainerColorClass(newPlayer.color)">
                      <div>
                        <input class="form-input form-inline create-game-player-name" :placeholder="getPlayerNamePlaceholder(newPlayer)" v-model="newPlayer.name" />
                      </div>
                      <div class="create-game-page-color-row">
                        <template v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple', 'Orange', 'Pink']">
                          <div v-bind:key="color">
                            <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color" :id="'radioBox' + color + newPlayer.index">
                            <label :for="'radioBox' + color + newPlayer.index">
                              <div :class="'create-game-colorbox '+getPlayerCubeColorClass(color)"></div>
                            </label>
                          </div>
                        </template>
                      </div>
                      <div>
                        <template v-if="beginnerOption">
                          <CreateGameToggle v-if="isBeginnerToggleEnabled()" v-model="newPlayer.beginner" title="Beginner?">
                            <template #prepend>
                              <i class="form-icon" />
                            </template>
                            <template #append>
                              <Tooltip link="https://github.com/bafolts/terraforming-mars/wiki/Variants#beginner-corporation" />
                            </template>
                          </CreateGameToggle>

                          <label class="form-label">
                            <input type="number" class="form-input form-inline player-handicap" value="0" min="0" :max="10" v-model.number="newPlayer.handicap" />
                            <i class="form-icon"></i><span v-i18n>TR Boost</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#tr-boost" class="tooltip" target="_blank">&#9432;</a>
                          </label>
                        </template>

                        <label class="form-radio form-inline" v-if="!randomFirstPlayer">
                          <input type="radio" name="firstIndex" :value="newPlayer.index" v-model="firstIndex">
                          <i class="form-icon"></i> <span v-i18n>Goes First?</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="create-game-action">
            <Button title="Create game" size="big" @click="createGame"/>

            <label>
              <div class="btn btn-primary btn-action btn-lg"><i class="icon icon-upload"></i></div>
              <input style="display: none" type="file" accept=".json" id="settings-file" ref="file" v-on:change="handleSettingsUpload()"/>
            </label>

            <label>
              <div v-on:click="downloadCurrentSettings()" class="btn btn-primary btn-action btn-lg"><i class="icon icon-download"></i></div>
            </label>
          </div>
        </div>
      </div>
    </div>


    <div class="create-game--block" v-if="showCorporationList">
      <CorporationsFilter
        ref="corporationsFilter"
        v-on:corporation-list-changed="updateCustomCorporationsList"
        v-bind:corporateEra="corporateEra"
        v-bind:prelude="prelude"
        v-bind:venusNext="venusNext"
        v-bind:colonies="colonies"
        v-bind:turmoil="turmoil"
        v-bind:promoCardsOption="promoCardsOption"
        v-bind:communityCardsOption="communityCardsOption"
        v-bind:moonExpansion="moonExpansion"
      ></CorporationsFilter>
    </div>

    <div class="create-game--block" v-if="showColoniesList">
      <ColoniesFilter
        ref="coloniesFilter"
        v-on:colonies-list-changed="updateCustomColoniesList"
        v-bind:venusNext="venusNext"
        v-bind:turmoil="turmoil"
        v-bind:communityCardsOption="communityCardsOption"
      ></ColoniesFilter>
    </div>

    <div class="create-game--block" v-if="showCardsBlackList">
      <CardsFilter
        ref="cardsFilter"
        v-on:cards-list-changed="updateCardsBlackList"
      ></CardsFilter>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Color} from '@/Color';
import {BoardName, RandomBoardOption} from '@/boards/BoardName';
import {CardName} from '@/CardName';
import CorporationsFilter from '@/client/components/create/CorporationsFilter.vue';
import {translateTextWithParams} from '@/client/directives/i18n';
import {IGameData} from '@/database/IDatabase';
import ColoniesFilter from '@/client/components/create/ColoniesFilter.vue';
import {ColonyName} from '@/colonies/ColonyName';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import Button from '@/client/components/common/Button.vue';
import {playerColorClass} from '@/utils/utils';
import {RandomMAOptionType} from '@/RandomMAOptionType';
import {GameId} from '@/Game';
import {AgendaStyle} from '@/turmoil/PoliticalAgendas';
import CreateGameToggle from '@/client/components/create/CreateGameToggle.vue';
import Tooltip from '@/client/components/common/Tooltip.vue';

import * as constants from '@/constants';

type BoardNameType = BoardName | RandomBoardOption;

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
    board: BoardNameType;
    boards: Array<BoardNameType>;
    seed: number;
    solarPhaseOption: boolean;
    shuffleMapOption: boolean;
    promoCardsOption: boolean;
    communityCardsOption: boolean;
    aresExtension: boolean;
    politicalAgendasExtension: AgendaStyle;
    moonExpansion: boolean;
    pathfindersExpansion: boolean;
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
    moonStandardProjectVariant: boolean;
    altVenusBoard: boolean;
    seededGame: boolean;
    escapeVelocityMode: boolean;
    escapeVelocityThreshold: number;
    escapeVelocityPeriod: number;
    escapeVelocityPenalty: number;
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
  data(): CreateGameModel {
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
      randomMA: RandomMAOptionType.NONE as RandomMAOptionType,
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
        RandomBoardOption.OFFICIAL,
        BoardName.ARABIA_TERRA,
        RandomBoardOption.ALL,
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
      pathfindersExpansion: false,
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
      moonStandardProjectVariant: false,
      altVenusBoard: false,
      escapeVelocityMode: false,
      escapeVelocityThreshold: constants.DEFAULT_ESCAPE_VELOCITY_THRESHOLD,
      escapeVelocityPeriod: constants.DEFAULT_ESCAPE_VELOCITY_PERIOD,
      escapeVelocityPenalty: constants.DEFAULT_ESCAPE_VELOCITY_PENALTY,
    };
  },
  components: {
    Button,
    CardsFilter,
    ColoniesFilter,
    CorporationsFilter,
    CreateGameToggle,
    Tooltip,
  },
  mounted() {
    if (window.location.pathname === '/solo') {
      this.isSoloModePage = true;
    }

    const onSuccess = (response: any) => {
      this.cloneGameData = response;
    };

    fetch('/api/clonablegames')
      .then((response) => response.json())
      .then(onSuccess)
      .catch((_) => alert('Unexpected server response'));
  },

  computed: {
    isRandomMAEnabled: {
      get: function(): boolean {
        return this.randomMA !== RandomMAOptionType.NONE;
      },
      set: function() {
        if (this.randomMA !== RandomMAOptionType.NONE) {
          this.randomMA = RandomMAOptionType.NONE;
        } else {
          this.randomMA = RandomMAOptionType.LIMITED;
        }
      },
    },
    isPoliticalAgendasExtensionEnabled: {
      get: function(): boolean {
        return this.politicalAgendasExtension !== AgendaStyle.STANDARD;
      },
      set: function() {
        if (this.politicalAgendasExtension === AgendaStyle.STANDARD) {
          this.politicalAgendasExtension = AgendaStyle.RANDOM;
        } else {
          this.politicalAgendasExtension = AgendaStyle.STANDARD;
        }
      },
    },
    maps() {
      return {
        AgendaStyle,
        RandomMAOptionType,
      };
    },
  },

  watch: {
    venusNext(value) {
      this.solarPhaseOption = value;
    },
    turmoil(value) {
      if (!value) {
        this.politicalAgendasExtension = AgendaStyle.STANDARD;
      }
    },
  },

  methods: {
    downloadCurrentSettings() {
      const serializedData = this.serializeSettings();

      if (serializedData) {
        const a = document.createElement('a');
        const blob = new Blob([serializedData], {'type': 'application/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'tm_settings.json';
        a.click();
      }
    },
    handleSettingsUpload() {
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
    getPlayerNamePlaceholder(player: NewPlayerModel): string {
      return translateTextWithParams(
        'Player ${0} name',
        [String(player.index)],
      );
    },
    updateCustomCorporationsList(newCustomCorporationsList: Array<CardName>) {
      const component = (this as any) as CreateGameModel;
      component.customCorporationsList = newCustomCorporationsList;
    },
    updateCardsBlackList(newCardsBlackList: Array<CardName>) {
      const component = (this as any) as CreateGameModel;
      component.cardsBlackList = newCardsBlackList;
    },
    updateCustomColoniesList(newCustomColoniesList: Array<ColonyName>) {
      const component = (this as any) as CreateGameModel;
      component.customColoniesList = newCustomColoniesList;
    },
    getPlayers(): Array<NewPlayerModel> {
      const component = (this as any) as CreateGameModel;
      return component.players.slice(0, component.playersCount);
    },
    isBeginnerToggleEnabled(): Boolean {
      return !(this.initialDraft || this.prelude || this.venusNext || this.colonies || this.turmoil);
    },
    selectAll() {
      this.corporateEra = this.$data.allOfficialExpansions;
      this.prelude = this.$data.allOfficialExpansions;
      this.venusNext = this.$data.allOfficialExpansions;
      this.colonies = this.$data.allOfficialExpansions;
      this.turmoil = this.$data.allOfficialExpansions;
      this.promoCardsOption = this.$data.allOfficialExpansions;
      this.solarPhaseOption = this.$data.allOfficialExpansions;
    },
    getBoardColorClass(boardName: string): string {
      if (boardName === BoardName.ORIGINAL) {
        return 'create-game-board-hexagon create-game-tharsis';
      } else if (boardName === BoardName.HELLAS) {
        return 'create-game-board-hexagon create-game-hellas';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'create-game-board-hexagon create-game-elysium';
      } else if (boardName === BoardName.ARABIA_TERRA) {
        return 'create-game-board-hexagon create-game-arabia-terra';
      } else {
        return 'create-game-board-hexagon create-game-random';
      }
    },
    getPlayerCubeColorClass(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg');
    },
    getPlayerContainerColorClass(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg_transparent');
    },
    serializeSettings() {
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
      const pathfindersExpansion = component.pathfindersExpansion;
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
      const escapeVelocityMode = component.escapeVelocityMode;
      const escapeVelocityThreshold = component.escapeVelocityMode ? component.escapeVelocityThreshold : undefined;
      const escapeVelocityPeriod = component.escapeVelocityMode ? component.escapeVelocityPeriod : undefined;
      const escapeVelocityPenalty = component.escapeVelocityMode ? component.escapeVelocityPenalty : undefined;
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
          window.alert(this.$t('Player count mismatch'));
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
        pathfindersExpansion: pathfindersExpansion,
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
        requiresMoonTrackCompletion: component.requiresMoonTrackCompletion,
        moonStandardProjectVariant: component.moonStandardProjectVariant,
        altVenusBoard: component.altVenusBoard,
        escapeVelocityMode,
        escapeVelocityThreshold,
        escapeVelocityPeriod,
        escapeVelocityPenalty,
      }, undefined, 4);
      return dataToSend;
    },
    createGame() {
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
<style scoped>
.create-game-expansion-icon {
  /* no need margin anymore on create game page, but class still used on other pages*/
  margin: 0;
}
</style>
