
var CARDS = require("../../data/cards.json");
var CORPORATION_CARDS = require("../../data/corporationCards.json");

import { CorporationCard } from "./CorporationCard";
import * as utilities from "./utilities";
import { Player } from "./Player";
import { Dealer } from "./Dealer";
import { ISpace } from "./ISpace";
import { SpaceType } from "./SpaceType";
import { TileType } from "./TileType";
import { SpaceBonus } from "./SpaceBonus";
import { ITile } from "./ITile";
import { IProjectCard } from "./cards/IProjectCard";

const MAX_OXYGEN_LEVEL: number = 32;
const MAX_OCEAN_TILES: number = 9;

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
    public id: string = utilities.generateUUID();
    public dealer: Dealer = new Dealer();
    private spaces: Array<ISpace> = [];
    private players: Array<Player> = [];
    private onGreeneryPlaced: Array<Function> = [];
    private onCityTilePlaced: Array<Function> = [];
    public addGreeneryPlacedListener(listener: Function): void {
        this.onGreeneryPlaced.push(listener);
    }
    public addCityTilePlacedListener(listener: Function): void {
        this.onCityTilePlaced.push(listener);
    }

    private onGameEnd: Array<Function> = [];
    private onGenerationEnd: Array<Function> = [];

    // which player will go first
    // shifts clockwise each generation
    private firstPlayerIndex: number = 0;

    private phase: string = "research";

    private generation: number = 1;
    public oxygenLevel: number = 1;
    public temperature: number = -100;
    public oceansPlaced: number = 0;

    public setGeneration(generation: number): void {
        if (generation !== this.generation) {
            this.onGenerationEnd.slice().forEach(function (end) {
                end();
            });
        }
        this.generation = generation;
    }

    public addGameEndListener(end: Function): void {
        this.onGameEnd.push(end);
    }

    public getPlayerById(playerId: string): Player {
        const foundPlayers = this.players.filter((player) => player.id === playerId);
        if (foundPlayers.length === 0) {
            throw "Player not found";
        }
        return foundPlayers[0];
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
    public getSpace(id: string): ISpace {
        const matchedSpaces = this.spaces.filter((space) => space.id === id);
        if (matchedSpaces.length === 1) {
            return matchedSpaces[0];
        }
        throw "Error with getting space";
    }
    public getCitiesInPlay(): number {
        return this.spaces.filter((space) => space.tile !== undefined && space.tile.tileType === TileType.CITY).length;
    }
    public getSpaces(spaceType: SpaceType): Array<ISpace> {
        return this.spaces.filter((space) => space.spaceType === spaceType);
    }
    private addTile(player: Player, spaceType: SpaceType, space: ISpace, tile: ITile): void {
        if (space.tile !== undefined) {
            throw "Selected space is occupied";
        }
        if (space.spaceType !== spaceType) {
            throw "Select a valid location";
        }
        space.player = player;
        space.tile = tile;
        if (space.bonus) {
            space.bonus.forEach(function (spaceBonus) {
                if (spaceBonus === SpaceBonus.DRAW_CARD) {
                    player.cardsInHand.push(this.dealer.getCard(1));
                } else if (spaceBonus === SpaceBonus.PLANT) {
                    player.plants++;
                } else if (spaceBonus === SpaceBonus.STEEL) {
                    player.steel++;
                } else if (spaceBonus === SpaceBonus.TITANIUM) {
                    player.titanium++;
                }
            });
        }
    }
    public getAdjacentSpaces(space: ISpace): Array<ISpace> {
        // TODO Implement this method
        return [];
    }
    public addGreenery(player: Player, spaceId: string, spaceType: SpaceType = SpaceType.LAND): void {
        this.addTile(player, spaceType, this.getSpace(spaceId), { tileType: TileType.GREENERY });
        if (this.oxygenLevel < MAX_OXYGEN_LEVEL) {
            this.oxygenLevel++;
            player.terraformRating++;
        }
        this.onGreeneryPlaced.forEach((fn: Function) => {
            fn(player);
        });
    }
    public addCityTile(player: Player, spaceId: string): void {
        this.addTile(player, SpaceType.LAND, this.getSpace(spaceId), { tileType: TileType.CITY });
        this.onCityTilePlaced.forEach((fn: Function) => {
            fn();
        }); 
    }
    public addOceanTile(player: Player, spaceId: string): void {
        this.addTile(player, SpaceType.OCEAN, this.getSpace(spaceId), { tileType: TileType.OCEAN });
        // No one can own the oceans!
        this.getSpace(spaceId).player = undefined;
        player.terraformRating++;
    }
    public getOceansOnBoard(): number {
        return this.getSpaces(SpaceType.OCEAN).filter((space) => space.tile !== undefined && space.tile.tileType === TileType.OCEAN).length + this.getSpaces(SpaceType.LAND).filter((space) => space.tile !== undefined && space.tile.tileType === TileType.OCEAN).length;
    }
    public getPlayers(): Array<Player> {
        return this.players;
    }
    public getCard(name: string): IProjectCard | undefined {
        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players[i].playedCards.length; j++) {
                if (this.players[i].playedCards[j].name === name) {
                    return this.players[i].playedCards[j];
                }
            }
        }
    }
}

