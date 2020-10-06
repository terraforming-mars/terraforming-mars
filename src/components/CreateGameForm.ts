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
            cloneGameData: []
        } as CreateGameModel
    },
    components: {
        "corporations-filter": CorporationsFilter,
        "colonies-filter": ColoniesFilter,
        "cards-filter": CardsFilter
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

            if (component.board === "random") {
                const boards = Object.values(BoardName);
                this.board = boards[Math.floor(Math.random() * boards.length)];
            }

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
                        <div>
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

                    <div class="columns">
                        <div class="create-game-options-block col3 col-sm-6" v-if="! isSoloModePage">
                            <h4 v-i18n>Players count</h4>

                            <label class="form-radio" v-for="pCount in [1,2,3,4,5,6]">
                                <input type="radio" :value="pCount" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> <span v-html="pCount === 1 ? 'Solo' : pCount"></span>
                            </label>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4 v-i18n>Expansions</h4>
                            <div class="expansion-label">Official</div>
                            <label class="form-switch">
                                <input type="checkbox" name="corporateEra" v-model="corporateEra">
                                <i class="form-icon"></i> <span v-i18n>Corporate Era</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="prelude" v-model="prelude">
                                <i class="form-icon"></i> <span v-i18n>Prelude</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="venusNext" v-model="venusNext">
                                <i class="form-icon"></i> <span v-i18n>Venus Next</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="colonies"  v-model="colonies">
                                <i class="form-icon"></i> <span v-i18n>Colonies</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="turmoil"  v-model="turmoil">
                                <i class="form-icon"></i> <span v-i18n>Turmoil</span>
                            </label>
                            
                            <label class="form-switch">
                                <input type="checkbox" v-model="promoCardsOption">
                                <i class="form-icon"></i> <span v-i18n>Promos</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#promo-cards" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <div class="create-game-divider" />

                            <div class="expansion-label">Fan-made</div>
                            <label class="form-switch">
                                <input type="checkbox" v-model="communityCardsOption">
                                <i class="form-icon"></i> <span v-i18n>Community</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#community-corps" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4 v-i18n>Options</h4>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="draftVariant" v-model="draftVariant">
                                <i class="form-icon"></i> <span v-i18n>Draft variant</span>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="initialDraft" v-model="initialDraft">
                                <i class="form-icon"></i> <span v-i18n>Initial Draft variant</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#initial-draft" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="showCorporationList">
                                <i class="form-icon"></i> <span v-i18n>Custom Corporation list</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="showCardsBlackList">
                                <i class="form-icon"></i> <span v-i18n>Exclude some cards</span>
                            </label>

                            <label class="form-switch" v-if="colonies">
                                <input type="checkbox" v-model="showColoniesList">
                                <i class="form-icon"></i> <span v-i18n>Custom Colonies list</span>
                            </label>

                            <label class="form-switch" v-if="playersCount === 1">
                                <input type="checkbox" v-model="soloTR">
                                <i class="form-icon"></i> <span v-i18n>63 TR solo mode</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#tr-solo-mode" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" v-model="randomFirstPlayer">
                                <i class="form-icon"></i> <span v-i18n>Random first player</span>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="randomMA" v-model="randomMA">
                                <i class="form-icon"></i> <span v-i18n>Random Milestones/Awards</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#random-milestones-and-awards" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="showOtherPlayersVP" v-model="showOtherPlayersVP">
                                <i class="form-icon"></i> <span v-i18n>Show real-time VP</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#show-real-time-vp" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                            
                            <label class="form-switch">
                                <input type="checkbox" v-model="solarPhaseOption">
                                <i class="form-icon"></i> <span v-i18n>World Government Terraforming</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#solar-phase" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="undoOption">
                                <i class="form-icon"></i> <span v-i18n>Allow undo</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#allow-undo" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="fastModeOption">
                                <i class="form-icon"></i> <span v-i18n>Fast mode</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#fast-mode" class="tooltip" target="_blank">&#9432;</a>
                            </label>                            

                            <label class="form-switch">
                                <input type="checkbox" v-model="shuffleMapOption">
                                <i class="form-icon"></i> <span v-i18n>Randomize board tiles</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#randomize-board-tiles" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch" v-if="turmoil">
                                <input type="checkbox" v-model="removeNegativeGlobalEventsOption">
                                <i class="form-icon"></i> <span v-i18n>Remove negative Global Events</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#remove-negative-global-events" class="tooltip" target="_blank">&#9432;</a>
                            </label>

                            <label class="form-switch" v-if="venusNext && playersCount > 1">
                                <input type="checkbox" v-model="includeVenusMA">
                                <i class="form-icon"></i> <span v-i18n>Venus Milestone/Award</span>
                            </label>

                            <label class="form-label">
                                <input type="number" class="form-input form-inline create-game-corporations-count" value="2" min="1" :max="6" v-model="startingCorporations" />
                                <i class="form-icon"></i> <span v-i18n>Starting Corporations</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="seededGame">
                                <i class="form-icon"></i> <span v-i18n>Set Predefined Game</span>&nbsp;<a href="https://github.com/bafolts/terraforming-mars/wiki/Variants#set-predefined-game" class="tooltip" target="_blank">&#9432;</a>
                            </label>
                            <div v-if="seededGame">
                                <select name="clonedGamedId" v-model="clonedGameData">
                                    <option v-for="game in cloneGameData" :value="game" :key="game.gameId">
                                        {{ game.gameId }} - {{ game.playerCount }} player(s)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4 v-i18n>Board</h4>

                            <label class="form-radio" v-for="boardName in boards">
                                <input type="radio" :value="boardName" name="board" v-model="board">
                                <i class="form-icon"></i> <span class="capitalized" v-i18n>{{ boardName }}</span>
                            </label>
                        </div>

                        <div class="create-game-action">			
                            <button class="btn btn-lg btn-success" v-on:click="createGame" v-i18n>Create Game</button> 
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
                            <div>
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
            ></colonies-filter>

            <cards-filter
                v-if="showCardsBlackList"
                v-on:cards-list-changed="updateCardsBlackList"
            ></cards-filter>
        </div>
    `
});

