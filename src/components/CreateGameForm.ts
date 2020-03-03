
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
    showCorporationList: boolean;
    board: BoardName;
    showSeed: boolean;
    seed: number;
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
                {index: 5, name: "", color: Color.BLACK, beginner: false, first: false}
            ],
            prelude: false,
            draftVariant: true,
            randomFirstPlayer: true,
            venusNext: false,
            colonies: false,
            customCorporationsList: false,
            corporations: [...ALL_CORPORATION_CARDS, ...ALL_PRELUDE_CORPORATIONS, ...ALL_VENUS_CORPORATIONS, ...ALL_COLONIES_CORPORATIONS, ...ALL_TURMOIL_CORPORATIONS, ...ALL_PROMO_CORPORATIONS],
            showCorporationList: false,
            board: BoardName.ORIGINAL,
            showSeed: false,
            seed: Math.random()
        } as CreateGameModel
    },
    methods: {
        getPlayers: function (): Array<NewPlayerModel> {
            return this.players.slice(0, this.playersCount);
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
        createGame: function () {
            if (this.randomFirstPlayer) {
                this.firstIndex = Math.floor(this.seed * this.playersCount) + 1;
            }

            // Set player name for solo mode
            if (this.playersCount === 1 && this.players[0].name === "") {
                this.players[0].name = "You";
            }

            const players = this.players.slice(0, this.playersCount + 1).map((player: any) => {
                player.first = (this.firstIndex === player.index);
                return player;
            }).filter((player: any) => player.name);
            
            // TODO Check if all players has different colors

            // TODO Check all names to be set

            const prelude = this.$data.prelude;
            const draftVariant = this.$data.draftVariant;
            const venusNext = this.$data.venusNext;
            const colonies = this.$data.colonies;
            const corporations = this.$data.corporations;
            const customCorporationsList = this.$data.customCorporationsList;
            const board =  this.$data.board;
            const seed = this.$data.seed;
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", "/game");
            xhr.onerror = function () {
                alert("Error creating game");
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (xhr.response.players.length === 1) {
                        window.location.href = "/player?id=" + xhr.response.players[0].id;
                        return;
                    } else {
                        window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/game?id=" + xhr.response.id);
                        this.$root.$data.game = xhr.response;
                        this.$root.$data.screen = "game-home";
                    }
                } else {
                    alert("Unexpected server response");
                }
            };
            xhr.responseType = "json";
            xhr.send(JSON.stringify({
                players: players, prelude, draftVariant, venusNext, colonies, customCorporationsList, corporations, board, seed
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

                            <label class="form-radio" v-for="pCount in [1,2,3,4,5]">
                                <input type="radio" :value="pCount" name="playersCount" v-model="playersCount">
                                <i class="form-icon"></i> <span v-html="pCount === 1 ? 'Solo' : pCount"></span>
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
                                <input type="checkbox" v-model="customCorporationsList" v-on:click="showCorporationList = !showCorporationList">
                                <i class="form-icon"></i> Custom Corporation list
                            </label>

                            <label class="form-switch" v-if="playersCount > 1">
                                <input type="checkbox" v-model="randomFirstPlayer">
                                <i class="form-icon"></i> Random first player
                            </label>

                            <label class="form-switch">
                                <input type="checkbox" v-model="seededGame" v-on:click="showSeed = !showSeed" >
                                <i class="form-icon"></i> Show seed
                            </label>
                            <div v-if="showSeed">
                                <input class="form-input form-inline" v-model="seed" />
                            </div>

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
                        <div class="form-group col6 create-game-player create-game--block" v-for="newPlayer in getPlayers()">
                            <div>
                                <input class="form-input form-inline create-game-player-name" :placeholder="'Player ' + newPlayer.index + ' name'" v-model="newPlayer.name" />
                            </div>
                            <div>
                                <label class="form-label form-inline">Color:</label>
                                <label class="form-radio form-inline" v-for="color in ['Red', 'Green', 'Yellow', 'Blue', 'Black']">
                                    <input type="radio" :value="color.toLowerCase()" :name="'playerColor' + newPlayer.index" v-model="newPlayer.color">
                                    <i class="form-icon"></i> {{ color }}
                                </label>
                            </div>
                            <div>
                                <label class="form-switch form-inline">
                                    <input type="checkbox" v-model="newPlayer.beginner">
                                    <i class="form-icon"></i> Beginner?
                                </label>

                                <label class="form-radio form-inline" v-if="!randomFirstPlayer">
                                    <input type="radio" name="firstIndex" :value="newPlayer.index" v-model="firstIndex">
                                    <i class="form-icon"></i> Goes First?
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="showCorporationList">

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

