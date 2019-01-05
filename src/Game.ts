
var CARDS = require("../../data/cards.json");
var CORPORATION_CARDS = require("../../data/corporationCards.json");

import { CorporationCard } from "./CorporationCard";
import * as utilities from "./utilities";
import { Player } from "./Player";
import { Dealer } from "./Dealer";

// STARTING
// IF PLAYER ISNT BEGINNER GIVE THEM 2 CORPORATION CARDS
// DEAL THEM 10 CARDS

// PLAYER ORDER PHASE, increase generation number and rotate first player (skipped first generation)
// RESEARCH PHASE, deal each player 4 cards (skipped first generation)
// ACTION PHASE, players take 1 or 2 actions or pass, rotate through players until all players pass
//    AVAILABLE ACTIONS
//      A) Play a card from your hand (see page 9).
//      B) Use a standard project (see page 10).
//      C) Claim a milestone (see page 10).
//      D) Fund an award (page 11).
//      E) Use the action on a blue card (see page 11).
//      F) Convert 8 plants into a greenery tile (which gives an oxy-gen increase) as described on the player board (see page 11).
//      G) Convert 8 heat into a temperature increase as described on the player board (see page 11)
// PRODUCTION PHASE
//      Player gets megacredits equal to terraform rating plus mega credit production, reset all card actions

/*
STANDARD PROJECTS
    1) Sell  patents:  
        You  may  discard  a  number  of  cards  from hand to gain the same number of M€.
    2) Power plant:
        For 11 M€ you get to increase your energy production 1 step.
    3) Asteroid:
        For  14  M€  you  get  to  increase  temperature  1 step (and your TR).
    4) Aquifer:
        For  18  M€  you  get  to  place  an  ocean  tile  (you also get 1 TR and collect any placement bonus for the tile, see page 5).
    5) Greenery:
        For  23  M€  you  get  to  place  a  greenery  tile, which  increases  oxygen  level  (and  your  TR)  1  step,  and collect any placement bonus for the tile. Put a player marker on the tile. (See page 5)
    6) City:
        For  25  M€  you  get  to  place  a  city  tile  (collect  any placement bonus for the tile, and place a player marker on it). You also get to increase your M€ production 1 step.
*/

// PROJECT CARDS
// active card (blue)
// automated card (green)
// events card (red)

export class Game {
    private hash: string = utilities.generateUUID();
    public dealer: Dealer = new Dealer();
    private players: Array<Player> = [];
    private onGenerationEnd: Array<Function> = [];

    // which player will go first
    // shifts clockwise each generation
    private firstPlayerIndex: number = 0;

    private phase: string = "research";

    private generation: number = 1;

    public setGeneration(generation: number): void {
        if (generation !== this.generation) {
            this.onGenerationEnd.slice().forEach(function (end) {
                end();
            });
        }
        this.generation = generation;
    }

    public addGenerationEndListener(end: Function): void {
        this.onGenerationEnd.push(end);
    }
    public removeGenerationEndListener(end: Function): void {
        for (var i = 0; i < this.onGenerationEnd.length; i++) {
            if (this.onGenerationEnd[i] === end) {
                this.onGenerationEnd.splice(i, 1);
                return;
            }
        }
        throw "Did not find remove listener for generation end";
    }

}

