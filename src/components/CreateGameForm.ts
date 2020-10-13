import Vue from "vue";
import { Color } from "../Color";
import { BoardName } from "../BoardName";
import { CardName } from "../CardName";
import { CorporationsFilter } from "./CorporationsFilter";
import { $t } from "../directives/i18n";
import { IGameData } from "../database/IDatabase";
import { ColoniesFilter } from "./ColoniesFilter";
import { ColonyName } from "../colonies/ColonyName";
import { CardsFilter } from "./CardsFilter";
import { Button } from "../components/common/Button";

interface CreateGameModel {
    firstIndex: number;
    playersCount: number;
    players: Array<NewPlayerModel>;
    corporateEra: boolean;
    prelude: boolean;
    draftVariant: boolean;
    initialDraft: boolean;
    randomMA: boolean;
    randomFirstPlayer: boolean;
    showOtherPlayersVP: boolean;
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
    board: BoardName | "random";
    seed: number;
    solarPhaseOption: boolean;
    shuffleMapOption: boolean;
    promoCardsOption: boolean;
    communityCardsOption: boolean;
    undoOption: boolean;
    fastModeOption: boolean;
    removeNegativeGlobalEventsOption: boolean;
    includeVenusMA: boolean;
    startingCorporations: number;
    soloTR: boolean;
    clonedGameData: IGameData | undefined;
    cloneGameData: Array<IGameData>;
    seededGame: boolean;
}

interface NewPlayerModel {
    index: number;
    name: string;
    color: Color;
    beginner: boolean;
    handicap: number;
    first: boolean;
}

export const CreateGameForm = Vue.component("create-game-form", {
    data: function () {
        return {
            firstIndex: 1,
            playersCount: 1,
            players: [
                {index: 1, name: "", color: Color.RED, beginner: false, handicap: 0, first: false},
                {index: 2, name: "", color: Color.GREEN, beginner: false, handicap: 0, first: false},
                {index: 3, name: "", color: Color.YELLOW, beginner: false, handicap: 0, first: false},
                {index: 4, name: "", color: Color.BLUE, beginner: false, handicap: 0, first: false},
                {index: 5, name: "", color: Color.BLACK, beginner: false, handicap: 0, first: false},
                {index: 6, name: "", color: Color.PURPLE, beginner: false, handicap: 0, first: false}
            ],
            corporateEra: true,
            prelude: false,
            draftVariant: true,
            initialDraft: false,
            randomMA: false,
            randomFirstPlayer: true,
            showOtherPlayersVP: false,
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
                "random"
            ],
            seed: Math.random(),
            seededGame: false,
            solarPhaseOption: false,
            shuffleMapOption: false,
            promoCardsOption: false,
            communityCardsOption: false,
            undoOption: false,
            fastModeOption: false,
            removeNegativeGlobalEventsOption: false,
            includeVenusMA: true,
            startingCorporations: 2,
            soloTR: false,
            clonedGameData: undefined,
            cloneGameData: [],
            allOfficialExpansions: false
        } as CreateGameModel
    },
    components: {
        "corporations-filter": CorporationsFilter,
        "colonies-filter": ColoniesFilter,
        "cards-filter": CardsFilter,
        "Button": Button
    },
    mounted: function () {
        if (window.location.pathname === "/solo") {
            this.isSoloModePage = true;
        }

        const onSucces = (response: any) => {
            this.$data.cloneGameData = response;
        }

        fetch("/api/clonablegames")
            .then(response => response.json())
            .then(onSucces)
            .catch(_ => alert("Unexpected server response"));
    },
    methods: { 
        getPlayerNamePlaceholder: function (player: NewPlayerModel): string {
            return $t("Player " + player.index + " name");
        },
        updateCustomCorporationsList: function (newCustomCorporationsList: Array<CardName>) {
            const component = (this as any) as CreateGameModel;
            component.customCorporationsList = newCustomCorporationsList;
        },
        updateCardsBlackList: function (newCardsBlackList: Array<CardName>) {
            const component = (this as any) as CreateGameModel;
            component.cardsBlackList = newCardsBlackList;
        },
        updateCustomColoniesList: function (newCustomColoniesList: Array<ColonyName>) {
            const component = (this as any) as CreateGameModel;
            component.customColoniesList = newCustomColoniesList;
        },
        getPlayers: function (): Array<NewPlayerModel> {
            const component = (this as any) as CreateGameModel;
            return component.players.slice(0, component.playersCount);
        },
        isBeginnerToggleEnabled: function(): Boolean {
            return !(this.initialDraft || this.prelude || this.venusNext || this.colonies || this.turmoil)
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
        selectWGTwhenVenus: function() {
            this.solarPhaseOption = this.$data.venusNext;
        },
        getBoardColorClass: function(boardName: string): string {
            if (boardName === BoardName.ORIGINAL){
                return "create-game-tharsis";
            } else if (boardName === BoardName.HELLAS) {
                return "create-game-hellas";
            } else if (boardName === BoardName.ELYSIUM) {
                return "create-game-elysium";
            } else {
                return "create-game-random";
            }
        },
        createGame: function () {
            const component = (this as any) as CreateGameModel;

            var players = component.players.slice(0, component.playersCount);

            if (component.randomFirstPlayer) {
                // Shuffle players array to assign each player a random seat around the table
                players = players.map((a) => ({sort: Math.random(), value: a}))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value)
                component.firstIndex = Math.floor(component.seed * component.playersCount) + 1;
            }

            // Auto assign an available color if there are duplicates
            const uniqueColors = players.map((player) => player.color).filter((v, i, a) => a.indexOf(v) === i);
            if (uniqueColors.length !== players.length) {
                const allColors = [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN, Color.BLACK, Color.PURPLE];
                players.forEach((player) => {
                    if (allColors.includes(player.color)) {
                        allColors.splice(allColors.indexOf(player.color), 1);
                    } else {
                        player.color = allColors.shift() as Color;
                    }
                })
            }

            // Set player name automatically if not entered
            const isSoloMode = component.playersCount === 1;

            component.players.forEach((player) => {
                if (player.name === "") {
                    if (isSoloMode) {
                        player.name = "You";
                    } else {
                        const defaultPlayerName = player.color.charAt(0).toUpperCase() + player.color.slice(1);
                        player.name = defaultPlayerName;
                    }
                }
            })

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
            const board =  component.board;
            console.log("USING " + board + " FOR THE BOARD");
            const seed = component.seed;
            const promoCardsOption = component.promoCardsOption;
            const communityCardsOption = component.communityCardsOption;
            const undoOption = component.undoOption;
            const fastModeOption = component.fastModeOption;
            const removeNegativeGlobalEventsOption = this.removeNegativeGlobalEventsOption;
            const includeVenusMA = component.includeVenusMA;
            const startingCorporations = component.startingCorporations;
            const soloTR = component.soloTR;
            let clonedGamedId: undefined | string = undefined;

            if (1 === 1) {
                alert("CHANGED IT");
                return;
            }
            if (customColoniesList.length > 0) {
                let playersCount = players.length;
                let neededColoniesCount = playersCount + 2;
                if (playersCount === 1) {
                    neededColoniesCount = 4;
                } else if (playersCount === 2) {
                    neededColoniesCount = 5;
                }

                if (customColoniesList.length < neededColoniesCount) {
                    window.alert("Must select at least " + neededColoniesCount + " colonies");
                    return
                }
            }

            // Clone game checks
            if (component.clonedGameData !== undefined && component.seededGame) {
                clonedGamedId = component.clonedGameData.gameId;
                if (component.clonedGameData.playerCount !== players.length) {
                    alert("Player count mismatch ");
                    this.$data.playersCount = component.clonedGameData.playerCount;
                    return;
                }
            } else if (!component.seededGame) {
                clonedGamedId = undefined;
            }

            const dataToSend = JSON.stringify({
                players: players,
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
                undoOption,
                fastModeOption,
                removeNegativeGlobalEventsOption,
                includeVenusMA,
                startingCorporations,
                soloTR,
                clonedGamedId,
                initialDraft,
                randomMA,
                shuffleMapOption,
            });

            const onSucces = (response: any) => {
                if (response.players.length === 1) {
                    window.location.href = "/player?id=" + response.players[0].id;
                    return;
                } else {
                    window.history.replaceState(response, "Teraforming Mars - Game", "/game?id=" + response.id);
                    (this as any).$root.$data.game = response;
                    (this as any).$root.$data.screen = "game-home";
                }
            }

            fetch("/game", {method: "PUT", "body": dataToSend, headers: {"Content-Type": "application/json"}})
                .then(response => response.json())
                .then(onSucces)
                .catch(_ => alert("Unexpected server response"));
        }
    },
    template: `
        <div id="create-game">
            <h1><span v-i18n>Terraforming Mars</span> — <span v-i18n>Create New Game</span></h1>

            <div class="create-game-form create-game--block">

                <div class="container create-game-options">

                    <div class="create-game-solo-player form-group" v-if="isSoloModePage" v-for="newPlayer in getPlayers()">
                        <div>
                            <input class="form-input form-inline create-game-player-name" placeholder="Your name" v-model="newPlayer.name" />
                        </div>
                        <div class="create-game-colors-wrapper">
                            <label class="form-label form-inline create-game-color-label" v-i18n>Color:</label>
                            <span class="create-game-colors-cont">
                            <label class="form-radio form-inline create-game-color" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple']">
                                <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                                <i class="form-icon"></i> <div :class="'board-cube board-cube--'+color.toLowerCase()"></div>
                            </label>
                            </span>
                        </div>
                        <div>
                            <label class="form-switch form-inline">
                                <input type="checkbox" v-model="newPlayer.beginner">
                                <i class="form-icon"></i> <span v-i18n>Beginner?</span>
                            </label>
                        </div>
                    </div>

                    <div class="create-game-page-container">
                        <div class="create-game-page-column" v-if="! isSoloModePage">
                            <h4 v-i18n># of Players</h4>
                                <template v-for="pCount in [1,2,3,4,5,6]">
                                    <input type="radio" :value="pCount" name="playersCount" v-model="playersCount" :id="pCount+'-radio'">
                                    <label :for="pCount+'-radio'">
                                        <span v-html="pCount === 1 ? 'Solo' : pCount"></span>
                                    </label>
                                </template>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Expansions</h4>

                            <input type="checkbox" name="allOfficialExpansions" id="allOfficialExpansions-checkbox" v-model="allOfficialExpansions" v-on:change="selectAll()">
                            <label for="allOfficialExpansions-checkbox">
                                <span v-i18n>All</span>
                            </label>

                            <input type="checkbox" name="corporateEra" id="corporateEra-checkbox" v-model="corporateEra">
                            <label for="corporateEra-checkbox" class="expansion-button">
                                <div class="create-game-expansion-icon expansion-icon-CE"></div>
                                <span v-i18n>Corporate Era</span>
                            </label>

                            <input type="checkbox" name="prelude" id="prelude-checkbox" v-model="prelude">
                            <label for="prelude-checkbox" class="expansion-button">
                                <div class="create-game-expansion-icon expansion-icon-prelude"></div>
                                <span v-i18n>Prelude</span>
                            </label>

                            <input type="checkbox" name="venusNext" id="venusNext-checkbox" v-model="venusNext" v-on:change="selectWGTwhenVenus()">
                            <label for="venusNext-checkbox" class="expansion-button">
                            <div class="create-game-expansion-icon expansion-icon-venus"></div>
                                <span v-i18n>Venus Next</span>
                            </label>

                            <input type="checkbox" name="colonies" id="colonies-checkbox" v-model="colonies">
                            <label for="colonies-checkbox" class="expansion-button">
                            <div class="create-game-expansion-icon expansion-icon-colony"></div>
                                <span v-i18n>Colonies</span>
                            </label>

                            <input type="checkbox" name="turmoil" id="turmoil-checkbox" v-model="turmoil">
                            <label for="turmoil-checkbox" class="expansion-button">
                                <div class="create-game-expansion-icon expansion-icon-turmoil"></div>
                                <span v-i18n>Turmoil</span>
                            </label>
                            
                            <input type="checkbox" name="promo" id="promo-checkbox" v-model="promoCardsOption">
                            <label for="promo-checkbox" class="expansion-button">
                                <div class="create-game-expansion-icon expansion-icon-promo"></div>
                                <span v-i18n>Promos</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#promo-cards" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <div class="create-game-subsection-label">Fan-made</div>

                            <input type="checkbox" name="fan-made" id="fan-made-checkbox" v-model="communityCardsOption">
                            <label for="fan-made-checkbox">
                                <span v-i18n>Community</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#community" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Board</h4>

                            <template v-for="boardName in boards">
                                <input type="radio" :value="boardName" name="board" v-model="board" :id="boardName+'-checkbox'">
                                <label :for="boardName+'-checkbox'" class="expansion-button">
                                    <span :class="getBoardColorClass(boardName)">&#x2B22;</span><span class="capitalized" v-i18n>{{ boardName }}</span>
                                </label>
                            </template>
                        </div>

                        <div class="create-game-page-column">
                            <h4 v-i18n>Options</h4>

                            <label for="startingCorpNum-checkbox">
                            <input type="number" class="create-game-corporations-count" value="2" min="1" :max="6" v-model="startingCorporations" id="startingCorpNum-checkbox">
                                <span v-i18n>Starting Corporations</span>
                            </label>

                            <input type="checkbox" v-model="solarPhaseOption" id="WGT-checkbox">
                            <label for="WGT-checkbox">
                                <span v-i18n>World Government Terraforming</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#solar-phase" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <template v-if="playersCount === 1">
                            <input type="checkbox" v-model="soloTR" id="soloTR-checkbox">
                            <label for="soloTR-checkbox">
                                <span v-i18n>63 TR solo mode</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#tr-solo-mode" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                            </template>

                            <input type="checkbox" v-model="undoOption" id="undo-checkbox">
                            <label for="undo-checkbox">
                                <span v-i18n>Allow undo</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#allow-undo" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <input type="checkbox" v-model="shuffleMapOption" id="shuffleMap-checkbox">
                            <label for="shuffleMap-checkbox">
                                    <span v-i18n>Randomize board tiles</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#randomize-board-tiles" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <input type="checkbox" v-model="seededGame" id="seeded-checkbox">
                            <label for="seeded-checkbox">
                                <span v-i18n>Set Predefined Game</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#set-predefined-game" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <div v-if="seededGame">
                                <select name="clonedGamedId" v-model="clonedGameData">
                                    <option v-for="game in cloneGameData" :value="game" :key="game.gameId">
                                        {{ game.gameId }} - {{ game.playerCount }} player(s)
                                    </option>
                                </select>
                            </div>


                            <div class="create-game-subsection-label">Filter</div>

                            <input type="checkbox" v-model="showCorporationList" id="customCorps-checkbox">
                            <label for="customCorps-checkbox">
                                <span v-i18n>Custom Corporation list</span>
                            </label>

                            <input type="checkbox" v-model="showCardsBlackList" id="blackList-checkbox">
                            <label for="blackList-checkbox">
                                <span v-i18n>Exclude some cards</span>
                            </label>

                            <template v-if="colonies">
                                <input type="checkbox" v-model="showColoniesList" id="customColonies-checkbox">
                                <label for="customColonies-checkbox">
                                    <span v-i18n>Custom Colonies list</span>
                                </label>
                            </template>
                            
                            <template v-if="turmoil">
                                <input type="checkbox" v-model="removeNegativeGlobalEventsOption" id="removeNegativeEvent-checkbox">
                                <label for="removeNegativeEvent-checkbox">
                                    <span v-i18n>Remove negative Global Events</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#remove-negative-global-events" class="tooltip" target="_blank">&#9432;</a>
                                </label>
                            </template>

                        </div>


                        <div class="create-game-page-column" v-if="playersCount > 1">
                            <h4 v-i18n>Multiplayer Options</h4>

                            <div class="create-game-page-column-row">
                                <input type="checkbox" name="draftVariant" v-model="draftVariant" id="draft-checkbox">
                                <label for="draft-checkbox">
                                    <span v-i18n>Draft variant</span>
                                </label>

                                <input type="checkbox" name="initialDraft" v-model="initialDraft" id="initialDraft-checkbox">
                                <label for="initialDraft-checkbox">
                                    <span v-i18n>Initial Draft variant</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#initial-draft" class="tooltip" target="_blank">&#9432;</a>
                                </label>
                            </div>

                            <input type="checkbox" v-model="randomFirstPlayer" id="randomFirstPlayer-checkbox">
                            <label for="randomFirstPlayer-checkbox">
                                <span v-i18n>Random first player</span>
                            </label>

                            <input type="checkbox" name="randomMA" v-model="randomMA" id="randomMA-checkbox">
                            <label for="randomMA-checkbox">
                                <span v-i18n>Random Milestones/Awards</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#random-milestones-and-awards" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <template v-if="venusNext">
                                <input type="checkbox" v-model="includeVenusMA" id="venusMA-checkbox">
                                <label for="venusMA-checkbox">
                                    <span v-i18n>Venus Milestone/Award</span>
                                </label>
                            </template>

                            <input type="checkbox" name="showOtherPlayersVP" v-model="showOtherPlayersVP" id="realTimeVP-checkbox">
                            <label for="realTimeVP-checkbox">
                                <span v-i18n>Show real-time VP</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#show-real-time-vp" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                            
                            <input type="checkbox" v-model="fastModeOption" id="fastMode-checkbox">
                            <label for="fastMode-checkbox">
                                <span v-i18n>Fast mode</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#fast-mode" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                        </div>

                        <div class="create-game-action">
                            <Button title="Create game" size="big" :onClick="createGame"/>
                        </div>  
                    </div>
                </div>
            </div>

            <div class="create-game-players-cont" v-if="playersCount > 1">
                <h2 v-i18n>Players</h2>
                <div class="container">
                    <div class="columns">
                        <div class="form-group col6 create-game-player create-game--block" v-for="newPlayer in getPlayers()">
                            <div>
                                <input class="form-input form-inline create-game-player-name" :placeholder="getPlayerNamePlaceholder(newPlayer)" v-model="newPlayer.name" />
                            </div>
                            <div class="flex">
                                <label class="form-label form-inline create-game-color-label" v-i18n>Color:</label>
                                <span class="create-game-colors-cont">
                                <label class="form-radio form-inline create-game-color" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple']">
                                    <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                                    <i class="form-icon"></i> <div :class="'board-cube board-cube--'+color.toLowerCase()"></div>
                                </label>
                                </span>
                            </div>
                            <div>
                                <label v-if="isBeginnerToggleEnabled()" class="form-switch form-inline">
                                    <input type="checkbox" v-model="newPlayer.beginner">
                                    <i class="form-icon"></i> <span v-i18n>Beginner?</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#beginner-corporation" class="tooltip" target="_blank">&#9432;</a>
                                </label>

                                <label class="form-label">
                                    <input type="number" class="form-input form-inline player-handicap" value="0" min="0" :max="10" v-model="newPlayer.handicap" />
                                    <i class="form-icon"></i><span v-i18n>TR Boost</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#tr-boost" class="tooltip" target="_blank">&#9432;</a>
                                </label>

                                <label class="form-radio form-inline" v-if="!randomFirstPlayer">
                                    <input type="radio" name="firstIndex" :value="newPlayer.index" v-model="firstIndex">
                                    <i class="form-icon"></i> <span v-i18n>Goes First?</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <corporations-filter
                v-if="showCorporationList"
                v-on:corporation-list-changed="updateCustomCorporationsList"
                v-bind:corporateEra="corporateEra"
                v-bind:prelude="prelude"
                v-bind:venusNext="venusNext"
                v-bind:colonies="colonies"
                v-bind:turmoil="turmoil"
                v-bind:promoCardsOption="promoCardsOption"
                v-bind:communityCardsOption="communityCardsOption"
            ></corporations-filter>

            <colonies-filter
                v-if="showColoniesList"
                v-on:colonies-list-changed="updateCustomColoniesList"
                v-bind:communityCardsOption="communityCardsOption"
            ></colonies-filter>

            <cards-filter
                v-if="showCardsBlackList"
                v-on:cards-list-changed="updateCardsBlackList"
            ></cards-filter>
        </div>
    `
});

