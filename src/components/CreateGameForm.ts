
import Vue from "vue";
import { Color } from "../Color";

import { CorporationCard } from '../cards/corporation/CorporationCard';
import { ALL_VENUS_CORPORATIONS, ALL_PRELUDE_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS } from '../Dealer';
import { BoardName } from '../BoardName';

interface CreateGameModel {
    firstIndex: number;
    playersCount: number;
    players: Array<NewPlayerModel>;
    prelude: boolean;
    draftVariant: boolean;
    randomFirstPlayer: boolean;
    venusNext: boolean;
    colonies: boolean;
    customCorporationsList: boolean;
    corporations: Array<CorporationCard>;
    displayed: boolean;
    board: BoardName;
}

interface NewPlayerModel {
    name: string;
    color: Color;
    beginner: boolean;
    first: boolean;
}


export const CreateGameForm = Vue.component("create-game-form", {
    data: function () {
        return {
            firstIndex: 0,
            playersCount: 1,
            players: [
                { name: "", color: Color.RED, beginner: false, first: false },
                { name: "", color: Color.GREEN, beginner: false, first: false },
                { name: "", color: Color.YELLOW, beginner: false, first: false },
                { name: "", color: Color.BLUE, beginner: false, first: false },
                { name: "", color: Color.BLACK, beginner: false, first: false }
            ],
            prelude: false,
            draftVariant: false,
            randomFirstPlayer: true,
            venusNext: false,
            colonies: false,
            customCorporationsList: false,
            corporations: [...ALL_CORPORATION_CARDS, ...ALL_PRELUDE_CORPORATIONS, ...ALL_VENUS_CORPORATIONS, ...ALL_COLONIES_CORPORATIONS, ...ALL_TURMOIL_CORPORATIONS, ...ALL_PROMO_CORPORATIONS],
            displayed: false,
            board: BoardName.ORIGINAL
        } as CreateGameModel
    },
    methods: {
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
        },
        getPlayersRange: function (): Array<number> {
            return Array.from({length: this.playersCount}, (_, key) => key)
        },
        getOriginalBoard: function () {
            return BoardName.ORIGINAL;
        },
        getHellasBoard: function () {
            return BoardName.HELLAS;
        },
        getElysiumBoard: function () {
            return BoardName.ELYSIUM;
        },
        getOriginalCorps: function () {
            return ALL_CORPORATION_CARDS;
        },
        getPreludeCorps: function () {
            return ALL_PRELUDE_CORPORATIONS;
        },
        getVenusCorps: function () {
            return ALL_VENUS_CORPORATIONS;
        },    
        getColoniesCorps: function () {
            return ALL_COLONIES_CORPORATIONS;
        },            
        getTurmoilCorps: function () {
            return ALL_TURMOIL_CORPORATIONS;
        }, 
        getPromoCorps: function () {
            return ALL_PROMO_CORPORATIONS;
        }, 
        randomInteger: function(min: number, max: number) {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        },
        createGame: function () {
            if (this.randomFirstPlayer) {
                this.firstIndex = this.randomInteger(0, this.playersCount-1);
            }

            // Set player name for solo mode
            if (this.playersCount === 1 && this.players[0].name === "") {
                this.players[0].name = "You";
            }

            const players = this.$data.players.slice(0, this.playersCount).map((player: any, index: number) => {
                player.first = (this.firstIndex === index);
                return player;
            }).filter((player: any) => player.name);

            // TODO Check if all players has different colors

            // Check all names to be set

            const prelude = this.$data.prelude;
            const draftVariant = this.$data.draftVariant;
            const venusNext = this.$data.venusNext;
            const colonies = this.$data.colonies;
            const corporations = this.$data.corporations;
            const customCorporationsList = this.$data.customCorporationsList;
            const board =  this.$data.board;
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", "/game");
            xhr.onerror = function () {
                alert("Error creating game");
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/game?id=" + xhr.response.id);
                    this.$root.$data.game = xhr.response;
                    this.$root.$data.screen = "game-home";
                } else {
                    alert("Unexpected server response");
                }
            };
            xhr.responseType = "json";
            xhr.send(JSON.stringify({
                players: players, prelude, draftVariant, venusNext, colonies, customCorporationsList, corporations, board
            }));
        }
    },
    template: `
        <div id="create-game">
            <h1>Terraforming Mars — Create New Game</h1>

            <div class="create-game-form create-game--block">

                <div class="container create-game-options">
                    <div class="columns">
                        <div class="create-game-options-block col3 col-sm-6">
                            <h4>Players count</h4>

                            <label class="form-radio">
                                <input type="radio" value="1" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> Solo
                            </label>

                            <label class="form-radio">
                                <input type="radio" value="2" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> 2
                            </label>

                            <label class="form-radio">
                                <input type="radio" value="3" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> 3
                            </label>

                            <label class="form-radio">
                                <input type="radio" value="4" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> 4
                            </label>

                            <label class="form-radio">
                                <input type="radio" value="5" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> 5
                            </label>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4>Extensions</h4>
                            <label class="form-switch">
                                <input type="checkbox" name="prelude" v-model="prelude">
                                <i class="form-icon"></i> Prelude
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="venusNext" v-model="venusNext">
                                <i class="form-icon"></i> Venus Next
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" name="colonies"  v-model="colonies">
                                <i class="form-icon"></i> Colonies
                            </label>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4>Options</h4>

                            <label class="form-switch">
                                <input type="checkbox" name="draftVariant" v-model="draftVariant">
                                <i class="form-icon"></i> Draft variant
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="customCorporationsList" v-on:click="toggleDisplayed()">
                                <i class="form-icon"></i> Custom Corporation list
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" v-model="randomFirstPlayer">
                                <i class="form-icon"></i> Random first player
                            </label>
                        </div>

                        <div class="create-game-options-block col3 col-sm-6">
                            <h4>Board</h4>

                            <label class="form-radio">
                                <input type="radio" :value=getOriginalBoard() name="board" v-model="board">
                                <i class="form-icon"></i> Original
                            </label>

                            <label class="form-radio">
                                <input type="radio" :value=getHellasBoard() name="board" v-model="board">
                                <i class="form-icon"></i> Hellas
                            </label>

                            <label class="form-radio">
                                <input type="radio" :value=getElysiumBoard() name="board" v-model="board">
                                <i class="form-icon"></i> Elysium
                            </label>
                        </div>
                    </div>

                    <div class="create-game-action">			
                        <button class="btn btn-lg btn-success" v-on:click="createGame">Create Game</button> 
                    </div>  

                </div>
            </div>

            <div class="create-game-players-cont" v-if="playersCount > 1">
                <h2>Players</h2>
                <div class="container">
                    <div class="columns">
                        <div class="form-group col6 create-game-player create-game--block" v-for="playerIndex in getPlayersRange()">
                            <div>
                                <input class="form-input form-inline" style="max-width: 430px" :placeholder="'Player ' + (playerIndex + 1) + ' name'" v-model="players[playerIndex].name" :id="'playerName' + playerIndex" type="text" />
                            </div>
                            <div>
                                <label class="form-label form-inline">Color:</label>
                                <label class="form-radio form-inline">
                                    <input type="radio" value="red" :name="'playerColor' + playerIndex" v-model="players[playerIndex].color">
                                    <i class="form-icon"></i> Red
                                </label>

                                <label class="form-radio form-inline">
                                    <input type="radio" value="green" :name="'playerColor' + playerIndex" v-model="players[playerIndex].color">
                                    <i class="form-icon"></i> Green
                                </label>

                                <label class="form-radio form-inline">
                                    <input type="radio" value="yellow" :name="'playerColor' + playerIndex" v-model="players[playerIndex].color">
                                    <i class="form-icon"></i> Yellow
                                </label>

                                <label class="form-radio form-inline">
                                    <input type="radio" value="blue" :name="'playerColor' + playerIndex" v-model="players[playerIndex].color">
                                    <i class="form-icon"></i> Blue
                                </label>

                                <label class="form-radio form-inline">
                                    <input type="radio" value="black" :name="'playerColor' + playerIndex" v-model="players[playerIndex].color">
                                    <i class="form-icon"></i> Black
                                </label>
                            </div>
                            <div>
                                <label class="form-switch form-inline">
                                    <input type="checkbox" v-model="players[playerIndex].beginner">
                                    <i class="form-icon"></i> Beginner?
                                </label>

                                <label class="form-radio form-inline" v-if="!randomFirstPlayer">
                                    <input type="radio" name="firstIndex" v-model="firstIndex">
                                    <i class="form-icon"></i> Goes First?
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="displayed === true">

                <h2>Corporations</h2>

                <div class="container create-game--block">
                    <div class="columns">
                        <div class="col4 create-game-corporation">
                            <h2>Original</h2>
                            <div v-for="corporation in getOriginalCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox" v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>    
                            </div>
                        </div>

                        <div class="col4 create-game-corporation">
                            <h2>Prelude</h2>
                            <div v-for="corporation in getPreludeCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox"  v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>    
                            </div>
                        </div>

                        <div class="col4 create-game-corporation">
                            <h2>Venus Next</h2>
                            <div v-for="corporation in getVenusCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox"  v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>    
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="col4 create-game-corporation">
                            <h2>Colonies</h2>   
                            <div v-for="corporation in getColoniesCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox"  v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>    
                            </div>
                        </div>
    
                        <div class="col4 create-game-corporation">
                            <h2>Turmoil</h2>   
                            <div v-for="corporation in getTurmoilCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox"  v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>
                            </div> 
                        </div> 

                        <div class="col4 create-game-corporation">
                            <h2>Promo</h2>   
                            <div v-for="corporation in getPromoCorps()">
                                <label class="form-checkbox">
                                    <input type="checkbox"  v-model="corporations" :value="corporation"/>
                                    <i class="form-icon"></i>{{corporation.name}}
                                </label>
                            </div> 
                        </div>  
                    </div>              
                </div>              
            </div>

        </div>
    `
});

