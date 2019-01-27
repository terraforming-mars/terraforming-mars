
import { Player } from "./Player";
import { Dealer } from "./Dealer";
import { ISpace } from "./ISpace";
import { SpaceType } from "./SpaceType";
import { TileType } from "./TileType";
import { SpaceBonus } from "./SpaceBonus";
import { ITile } from "./ITile";
import { IProjectCard } from "./cards/IProjectCard";
import { OriginalBoard } from "./OriginalBoard";
import { SelectCard } from "./inputs/SelectCard";

const MIN_OXYGEN_LEVEL: number = 0;
const MAX_OXYGEN_LEVEL: number = 14;

const MIN_TEMPERATURE: number = -30;
const MAX_TEMPERATURE: number = 8;

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
export class Game {
    constructor(public id: string, private players: Array<Player>, private first: Player) {
        // Give each player their corporation cards
        for (let player of players) {
            if (!player.beginner) {
                player.corporationCardsDealt = this.dealer.getCorporationCards(2) 
                player.setWaitingFor(new SelectCard(this, "Select initial cards to buy", this.dealer.getCards(10)), (options: {[x: string]: string}) => {
                });
            } else {
                player.corporationCardsDealt = [this.dealer.beginnerCard]; 
            }
        }
        
    }
    public dealer: Dealer = new Dealer();
    private spaces: Array<ISpace> = new OriginalBoard().spaces;
    private onGreeneryPlaced: Array<Function> = [];
    private onCityTilePlaced: Array<Function> = [];
    private onOceanTilePlaced: Array<Function> = [];
    public addGreeneryPlacedListener(listener: Function): void {
        this.onGreeneryPlaced.push(listener);
    }
    public addCityTilePlacedListener(listener: Function): void {
        this.onCityTilePlaced.push(listener);
    }
    public addOceanTilePlacedListener(listener: Function): void {
        this.onOceanTilePlaced.push(listener);
    }
    private onGameEnd: Array<Function> = [];
    private onGenerationEnd: Array<Function> = [];

    private generation: number = 1;
    private oxygenLevel: number = MIN_OXYGEN_LEVEL;

    public increaseOxygenLevel(player: Player): Promise<void> {
        if (this.oxygenLevel < MAX_OXYGEN_LEVEL) {
            // BONUS FOR TEMPERATURE INCREASE AT 8
            if (this.oxygenLevel + 1 === 8) {
                return this.increaseTemperature(player).then(() => {
                    this.oxygenLevel++;
                    player.terraformRating++;
                    return Promise.resolve();
                });
            } else {
                this.oxygenLevel++;
                player.terraformRating++;
                return Promise.resolve();
            }
        }
        return Promise.resolve();
    }

    public getOxygenLevel(): number {
        return this.oxygenLevel;
    }

    private temperature: number = MIN_TEMPERATURE;

    public increaseTemperature(player: Player): Promise<void> {
        if (this.temperature < MAX_TEMPERATURE) {
            // BONUS FOR HEAT PRODUCTION AT -20 and -24
            // BONUS FOR OCEAN TILE AT 0
            if (this.temperature + 2 === -24 || this.temperature + 2 === -20) {
                player.heatProduction++;
                this.temperature += 2;
                return Promise.resolve();
            } else if (this.temperature + 2 === 0) {
                return new Promise((resolve, reject) => {
                    player.setWaitingFor({
                        initiator: "board",
                        type: "SelectASpace",
                        message: "Select a place for bonus ocean"
                    }, (spaceName: string) => {
                        try { this.addOceanTile(player, spaceName); }
                        catch (err) { reject(err); return; }
                        this.temperature += 2
                        resolve();
                    });
                });
            } else {
                this.temperature += 2;
            }
        }
        return Promise.resolve();
    }

    public getTemperature(): number {
        return this.temperature;
    }

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

    public getPlayer(name: string): Player {
        const foundPlayers = this.players.filter((player) => player.name === name);
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
    public getCitiesInPlayOnMars(): number {
        return this.spaces.filter((space) => space.tile !== undefined && space.tile.tileType === TileType.CITY && space.spaceType !== SpaceType.COLONY).length;
    }
    public getCitiesInPlay(): number {
        return this.spaces.filter((space) => space.tile !== undefined && space.tile.tileType === TileType.CITY).length;
    }
    public getSpaces(spaceType: SpaceType): Array<ISpace> {
        return this.spaces.filter((space) => space.spaceType === spaceType);
    }
    public addTile(player: Player, spaceType: SpaceType, space: ISpace, tile: ITile): void {
        if (space.tile !== undefined) {
            throw "Selected space is occupied";
        }
        // Land claim a player can claim land for themselves
        if (space.player !== undefined && space.player !== player) {
            throw "This space is land claimed by " + space.player.name;
        }
        if (space.spaceType !== spaceType) {
            throw "Select a valid location";
        }
        space.player = player;
        space.tile = tile;
        if (space.bonus) {
            space.bonus.forEach((spaceBonus) => {
                if (spaceBonus === SpaceBonus.DRAW_CARD) {
                    player.cardsInHand.push(this.dealer.getCards(1)[0]);
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
        if (space.y < 0 || space.y > 8) {
            throw "Unexpected space y value";
        }
        if (space.x < 0 || space.x > 8) {
            throw "Unexpected space x value";
        } 
        if (space.spaceType !== SpaceType.COLONY) {
            const leftSpace: Array<number> = [space.x - 1, space.y],
                rightSpace: Array<number> = [space.x + 1, space.y],
                topLeftSpace: Array<number> = [space.x, space.y - 1],
                topRightSpace: Array<number> = [space.x, space.y - 1],
                bottomLeftSpace: Array<number> = [space.x, space.y + 1],
                bottomRightSpace: Array<number> = [space.x, space.y + 1];
            if (space.y < 4) {
                bottomLeftSpace[0]--;
                topRightSpace[0]++;
            } else if (space.y === 4) {
                bottomRightSpace[0]++;
                topRightSpace[0]++;
            } else {
                bottomRightSpace[0]++;
                topLeftSpace[0]--;
            }
            return this.spaces.filter((aSpace) => {
                return space !== aSpace && aSpace.spaceType !== SpaceType.COLONY && (
                    (aSpace.x === leftSpace[0] && aSpace.y === leftSpace[1]) ||
                    (aSpace.x === rightSpace[0] && aSpace.y === rightSpace[1]) ||
                    (aSpace.x === topLeftSpace[0] && aSpace.y === topLeftSpace[1]) ||
                    (aSpace.x === topRightSpace[0] && aSpace.y === topRightSpace[1]) ||
                    (aSpace.x === bottomLeftSpace[0] && aSpace.y === bottomLeftSpace[1]) ||
                    (aSpace.x === bottomRightSpace[0] && aSpace.y === bottomRightSpace[1]));
            });
        }
        return [];
    }

    public addGreenery(player: Player, spaceId: string, spaceType: SpaceType = SpaceType.LAND): Promise<void> {
        this.addTile(player, spaceType, this.getSpace(spaceId), { tileType: TileType.GREENERY });
        return this.increaseOxygenLevel(player).then(() => {
            this.onGreeneryPlaced.forEach((fn: Function) => {
                fn(player);
            });
        });
    }
    public addCityTile(player: Player, spaceId: string): void {
        this.addTile(player, SpaceType.LAND, this.getSpace(spaceId), { tileType: TileType.CITY });
        this.onCityTilePlaced.forEach((fn: Function) => {
            fn();
        }); 
    }
    public addOceanTile(player: Player, spaceId: string): void {
        if (this.getOceansOnBoard() - 1 === MAX_OCEAN_TILES) {
            return;
        }
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

    public getOtherAnimalCards(c: IProjectCard): Array<IProjectCard> {
        const result: Array<IProjectCard> = [];
        this.players.forEach((player) => {
            player.playedCards.forEach((card) => {
                if (card.name !== c.name && card.animals !== undefined) {
                    result.push(card);
                }
            });
        });
        return result;
    }

    public getOtherMicrobeCards(c: IProjectCard): Array<IProjectCard> {
        const result: Array<IProjectCard> = [];
        this.players.forEach((player) => {
            player.playedCards.forEach((card) => {
                if (card.name !== c.name && card.microbes !== undefined) {
                    result.push(card);
                }
            });
        });
        return result;
    }

    public getPlayedCardsWithAnimals(): Array<IProjectCard> {
        const result: Array<IProjectCard> = [];
        this.players.forEach((player) => {
            player.playedCards.forEach((card) => {
                if (card.animals !== undefined) {
                    result.push(card);
                }
            });
        });
        return result;
    }
    public getCard(name: string): IProjectCard | undefined {
        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players[i].playedCards.length; j++) {
                if (this.players[i].playedCards[j].name === name) {
                    return this.players[i].playedCards[j];
                }
            }
        }
        return undefined;
    }
}

