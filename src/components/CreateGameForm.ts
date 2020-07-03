
import Vue from "vue";
import { Color } from "../Color";

import { BoardName } from "../BoardName";
import { CardName } from "../CardName";
import { CorporationsFilter } from "./CorporationsFilter";

import { $t } from "../directives/i18n";
import { IGameData } from "../database/IDatabase";


interface CreateGameModel {
    firstIndex: number;
    playersCount: number;
    players: Array<NewPlayerModel>;
    corporateEra: boolean;
    prelude: boolean;
    draftVariant: boolean;
    initialDraft: boolean;
    randomFirstPlayer: boolean;
    showOtherPlayersVP: boolean;
    venusNext: boolean;
    colonies: boolean;
    turmoil: boolean;
    customCorporationsList: Array<CardName>;
    showCorporationList: boolean;
    isSoloModePage: boolean,
    board: BoardName | "random";
    seed: number;
    solarPhaseOption: boolean;
    promoCardsOption: boolean;
    undoOption: boolean;
    heatFor: boolean;
    enhance: boolean;
    startingCorporations: number;
    soloTR: boolean;
    clonedGameData: IGameData | undefined;
    cloneGameData: Array<IGameData>;
}

interface NewPlayerModel {
    index: number;
    name: string;
    color: Color;
    beginner: boolean;
    first: boolean;
}

export const CreateGameForm = Vue.component("create-game-form", {
    data: function () {
        return {
            firstIndex: 1,
            playersCount: 1,
            players: [
                {index: 1, name: "", color: Color.RED, beginner: false, first: false},
                {index: 2, name: "", color: Color.GREEN, beginner: false, first: false},
                {index: 3, name: "", color: Color.YELLOW, beginner: false, first: false},
                {index: 4, name: "", color: Color.BLUE, beginner: false, first: false},
                {index: 5, name: "", color: Color.BLACK, beginner: false, first: false},
                {index: 6, name: "", color: Color.PURPLE, beginner: false, first: false}
            ],
            corporateEra: true,
            prelude: true,
            draftVariant: true,
            initialDraft: false,
            randomFirstPlayer: true,
            showOtherPlayersVP: true,
            venusNext: true,
            colonies: true,
            turmoil: true,
            customCorporationsList: [],
            showCorporationList: false,
            isSoloModePage: false,
            board: "random",
            boards: [
                BoardName.ORIGINAL,
                BoardName.HELLAS,
                BoardName.ELYSIUM,
                "random"
            ],
            seed: Math.random(),
            seededGame: false,
            solarPhaseOption: true,
            promoCardsOption: true,
            undoOption: true,
            heatFor: false,
            enhance: false,
            startingCorporations: 4,
            soloTR: false,
            clonedGameData: undefined,
            cloneGameData: []
        } as CreateGameModel
    },
    components: {
        "corporations-filter": CorporationsFilter,
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
        getPlayers: function (): Array<NewPlayerModel> {
            const component = (this as any) as CreateGameModel;
            return component.players.slice(0, component.playersCount);
        },
        createGame: function () {
            const component = (this as any) as CreateGameModel;
            if (component.randomFirstPlayer) {
                component.firstIndex = Math.floor(component.seed * component.playersCount) + 1;
            }

            // Set player name automatically if not entered
            const isSoloMode = component.playersCount === 1;

            component.players.forEach((player) => {
                if (player.name === "") {
                    if (isSoloMode) {
                        const userName = localStorage.getItem("userName") || "";
                        if( userName.length > 0){
                            player.name = userName;
                        }else{
                            player.name = "You";
                        }
                    } else {
                        const defaultPlayerName = player.color.charAt(0).toUpperCase() + player.color.slice(1);
                        player.name = defaultPlayerName;
                    }
                }
            })

            const players = component.players.slice(0, component.playersCount).map((player: any) => {
                player.first = (component.firstIndex === player.index);
                return player;
            });

            // TODO Check if all players has different colors

            if (component.board === "random") {
                const boards = Object.values(BoardName);
                this.board = boards[Math.floor(Math.random() * boards.length)];
            }
            
            const corporateEra = component.corporateEra;
            const prelude = component.prelude;
            const draftVariant = component.draftVariant;
            const initialDraft = component.initialDraft;
            const showOtherPlayersVP = component.showOtherPlayersVP;
            const venusNext = component.venusNext;
            const colonies = component.colonies;
            const turmoil = component.turmoil;
            const solarPhaseOption = this.solarPhaseOption;
            const customCorporationsList = component.customCorporationsList;
            const board =  component.board;
            const seed = component.seed;
            const promoCardsOption = component.promoCardsOption;
            const undoOption = component.undoOption;
            const heatFor = component.heatFor;
            const enhance = component.enhance;
            const startingCorporations = component.startingCorporations;
            const soloTR = component.soloTR;
            let clonedGamedId: undefined | string = undefined;

            // Clone game checks
            if (component.clonedGameData !== undefined) {
                clonedGamedId = component.clonedGameData.gameId;
                if (component.clonedGameData.playerCount !== players.length) {
                    alert("Player count mismatch ");
                    this.$data.playersCount = component.clonedGameData.playerCount;
                    return;
                }
            }

            const dataToSend = JSON.stringify({
                players: players, corporateEra, prelude, draftVariant, showOtherPlayersVP, venusNext, colonies, turmoil, customCorporationsList, board, seed, solarPhaseOption, promoCardsOption, undoOption, heatFor, enhance, startingCorporations, soloTR, clonedGamedId, initialDraft 
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
                            <label class="form-label form-inline">Color:</label>
                            <label class="form-radio form-inline" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple']">
                                <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                                <i class="form-icon"></i> <span v-i18n>{{ color }}</span>
                            </label>
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
                            <h4 v-i18n>Extensions</h4>
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

                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4 v-i18n>Options</h4>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="draftVariant" v-model="draftVariant">
                                <i class="form-icon"></i> <span v-i18n>Draft variant</span>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="initialDraft" v-model="initialDraft">
                                <i class="form-icon"></i> <span v-i18n>Initial Draft variant</span>
                            </label>
                            
                            <label class="form-switch">
                                <input type="checkbox" v-model="showCorporationList">
                                <i class="form-icon"></i> <span v-i18n>Custom Corporation list</span>
                            </label>

                            <label class="form-switch" v-if="playersCount === 1">
                                <input type="checkbox" v-model="soloTR">
                                <i class="form-icon"></i> <span v-i18n>TR solo mode</span>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" v-model="randomFirstPlayer">
                                <i class="form-icon"></i> <span v-i18n>Random first player</span>
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" name="showOtherPlayersVP" v-model="showOtherPlayersVP">
                                <i class="form-icon"></i> <span v-i18n>Show real-time VP</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="solarPhaseOption">
                                <i class="form-icon"></i> <span v-i18n>Use Solar Phase Option</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="promoCardsOption">
                                <i class="form-icon"></i> <span v-i18n>Use promo cards</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="undoOption">
                                <i class="form-icon"></i> <span v-i18n>Allow undo</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="heatFor">
                                <i class="form-icon"></i> <span v-i18n>七热升温</span>
                            </label>

                            <label class="form-label">
                                <input type="number" class="form-input form-inline create-game-corporations-count" value="2" min="1" :max="6" v-model="startingCorporations" />
                                <i class="form-icon"></i> <span v-i18n>Starting Corporations</span>
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="seededGame">
                                <i class="form-icon"></i> <span v-i18n>Set Predefined Game</span>
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
                <h2>Players</h2>
                <div class="container">
                    <div class="columns">
                        <div class="form-group col6 create-game-player create-game--block" v-for="newPlayer in getPlayers()">
                            <div>
                                <input class="form-input form-inline create-game-player-name" :placeholder="getPlayerNamePlaceholder(newPlayer)" v-model="newPlayer.name" />
                            </div>
                            <div>
                                <label class="form-label form-inline">Color:</label>
                                <label class="form-radio form-inline" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black', 'Purple']">
                                    <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                                    <i class="form-icon"></i> <span v-i18n>{{ color }}</span>
                                </label>
                            </div>
                            <div>
                                <label class="form-switch form-inline">
                                    <input type="checkbox" v-model="newPlayer.beginner">
                                    <i class="form-icon"></i> <span v-i18n>Beginner?</span>
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
            
            <corporations-filter v-if="showCorporationList" v-on:corporation-list-changed="updateCustomCorporationsList"></corporations-filter>

        </div>
    `
});

