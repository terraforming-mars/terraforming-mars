
import Vue from "vue";
import { Color } from "../Color";

import { CorporationCard } from '../cards/corporation/CorporationCard';
import { ALL_VENUS_CORPORATIONS, ALL_PRELUDE_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_COLONIES_CORPORATIONS, ALL_TURMOIL_CORPORATIONS, ALL_PROMO_CORPORATIONS } from '../Dealer';

interface CreateGameModel {
    firstIndex: number;
    players: Array<NewPlayerModel>;
    prelude: boolean;
    draftVariant: boolean;
    venusNext: boolean;
    customCorporationsList: boolean;
    corporations: Array<CorporationCard>;
    board: string,
    displayed: boolean;
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
            players: [
                { name: "", color: Color.RED, beginner: false, first: false },
                { name: "", color: Color.GREEN, beginner: false, first: false },
                { name: "", color: Color.YELLOW, beginner: false, first: false },
                { name: "", color: Color.BLUE, beginner: false, first: false },
                { name: "", color: Color.BLACK, beginner: false, first: false }
            ],
            prelude: false,
            draftVariant: false,

            venusNext: false,
            customCorporationsList: false,
            corporations: [...ALL_CORPORATION_CARDS, ...ALL_PRELUDE_CORPORATIONS, ...ALL_VENUS_CORPORATIONS, ...ALL_COLONIES_CORPORATIONS, ...ALL_TURMOIL_CORPORATIONS, ...ALL_PROMO_CORPORATIONS],
            board: "original",
            displayed: false
        } as CreateGameModel
    },
    methods: {
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
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
            const players = this.$data.players.slice().map((player: any, index: number) => {
                player.first = (this.$data.firstIndex === index);
                return player;
            }).filter((player: any) => player.name);
            const prelude = this.$data.prelude;
            const draftVariant = this.$data.draftVariant;
            const venusNext = this.$data.venusNext;
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
                players: players, prelude, draftVariant, venusNext, customCorporationsList, corporations, board
            }));
        }
    },
    template: `
        <div id="create-game">
            <h1>Terraforming Mars</h1>
            <h2>Create New Game</h2>
            <div class="nes-container with-title" v-for="playerIndex in [1, 2, 3, 4, 5]">
                <p class="nes-container.title">Player {{playerIndex}}</p>
                <div class="nes-field">
                    <label :for="'playerName' + playerIndex">Name:</label>
                    <input v-model="players[playerIndex - 1].name" :id="'playerName' + playerIndex" type="text" class="nes-input" />
                </div>
                <label :for="'playerColor' + playerIndex">Color:</label>
                <div class="nes-select">
                    <select :id="'playerColor' + playerIndex" v-model="players[playerIndex - 1].color">
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="blue">Blue</option>
                        <option value="black">Black</option>
                    </select>
                </div>
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="players[playerIndex - 1].beginner" />
                    <span>Is Beginner</span>
                </label>
                <label>
                    <input v-model="firstIndex" class="nes-radio" type="radio" v-bind:value="playerIndex - 1" />
                    <span>Goes First</span>
                </label>
            </div>
            <div>
                <label>
                        <input type="checkbox" class="nes-checkbox" v-model="prelude" />
                        <span>Use Prelude extension ?</span>
                </label>
                <label>
                        <input type="checkbox" class="nes-checkbox" v-model="venusNext" />
                        <span>Use Venus Next extension ?</span>
                </label>			
                <label>
                        <input type="checkbox" class="nes-checkbox" v-model="draftVariant" />
                        <span>Use draft variant ?</span>
                </label>
                <label>
                        <input type="checkbox" class="nes-checkbox" v-model="customCorporationsList"  v-on:click="toggleDisplayed()" />
                        <span>Use custom Corporation list ?</span>
                </label>
                
                <br>
                <label>Board:</label>
                <div class="nes-select">
                    <select :id="board" v-model="board">
                        <option value="original">Original board</option>
                        <option value="hellas">Hellas board</option>
                        <option value="elysium">Elysium board</option>
                    </select>
                </div>
                <br>

                <div v-if="displayed === true">
                <br>
                <h2>Original Corporations</h2>
                <div v-for="corporation in getOriginalCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>    
                </div>
                <br>
                <h2>Prelude Corporations</h2>
                <div v-for="corporation in getPreludeCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>    
                </div>
                <br>
                <h2>Venus Next Corporations</h2>
                <div v-for="corporation in getVenusCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>    
                </div>
                <br>
                <h2>Colonies Corporations</h2>   
                <div v-for="corporation in getColoniesCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>    
                </div>
                <br>  
                <h2>Turmoil Corporations</h2>   
                <div v-for="corporation in getTurmoilCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>
                </div> 
                <br>
                <h2>Promo Corporations</h2>   
                <div v-for="corporation in getPromoCorps()">
                <label>
                    <input type="checkbox" class="nes-checkbox" v-model="corporations" :value="corporation"/>
                    <span>{{corporation.name}}</span>
                </label>
                </div> 
                <br>                
            </div>

            </div>			
            <button class="nes-btn is-primary" v-on:click="createGame">Create Game</button>          

        </div>
    `
});

