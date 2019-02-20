
import { Player } from "./Player";
import { Dealer } from "./Dealer";
import { ISpace } from "./ISpace";
import { SpaceType } from "./SpaceType";
import { TileType } from "./TileType";
import { SpaceBonus } from "./SpaceBonus";
import { ITile } from "./ITile";
import { IProjectCard } from "./cards/IProjectCard";
import { BeginnerCorporation } from "./cards/corporation/BeginnerCorporation";
import { CorporationCard } from "./cards/corporation/CorporationCard";
import { OriginalBoard } from "./OriginalBoard";
import { SelectCard } from "./inputs/SelectCard";
import { SelectSpace } from "./inputs/SelectSpace";
import { AndOptions } from "./inputs/AndOptions";
import { PlayerInput } from "./PlayerInput";
import { Phase } from "./Phase";
import { Award } from "./Award";
import { Milestone } from "./Milestone";
import { Tags } from "./cards/Tags";
import * as constants from "./constants";

const MIN_OXYGEN_LEVEL: number = 0;
const MAX_OXYGEN_LEVEL: number = 14;

const MIN_TEMPERATURE: number = -30;

/*
MILESTONE "Claim a Milestone"
Milestone, pay 8 to buy, can only buy 3, gain 5 victory points
Terraformer: Having a terraform rating of at least 35
Mayor: Owning at least 3 city tiles
Gardener: Owning at least 3 greenery tiles
Builder: Having at least 8 building tags in play
Planner: Having at least 16 cards in your hand when you claim this milestone

AWARDS "Fund an Award"
8, then 14, then 20
if 2 players only award 5 for first
if tie, both players get 5
give 5 for first, 2 for second

Landlord: Owning the most tiles in play
Banker: Having the highest Megacredit production
Scientist: Having the most science tags in play
Thermalist: Having the most heat resource cubes
Miner: Having the most steel and titanium resource cubes
*/
export class Game {
    public activePlayer: Player;
    public claimedMilestones: Array<Milestone> = [];
    public fundedAwards: Array<Award> = [];
    public awardFundingCost: number = 8;
    constructor(public id: string, private players: Array<Player>, private first: Player) {
        this.activePlayer = first;
        // Give each player their corporation cards
        for (let player of players) {
            if (!player.beginner) {
                player.setWaitingFor(this.pickCorporationCard(player));
            } else {
                player.corporationCard = new BeginnerCorporation();
                player.cardsInHand = this.dealer.getCards(10);
                player.megaCredits = 42;
                this.playerIsFinishedWithResearchPhase(player);
            }
        }
        
    }

    public fundAward(award: Award): void {
        if (this.allAwardsFunded()) {
            throw "All awards already funded";
        }
        this.fundedAwards.push(award);
        if (this.fundedAwards.length === 1) {
            this.awardFundingCost = 14;
        } else if (this.fundedAwards.length === 2) {
            this.awardFundingCost = 20;
        }
        this.addGameEndListener(() => {
            this.giveAward(award);
        });
    }

    public giveAward(award: Award): void {
        const players: Array<Player> = this.players.slice();
        let getScore: (player: Player) => number;
        // Most tiles in play
        if (award === Award.LANDLORD) {
            getScore = (player: Player) => {
                return this.spaces.filter((space) => space.tile !== undefined && space.player === player).length;
            };
        }
        // Highest megacredit production
        else if (award === Award.BANKER) {
            getScore = (player: Player) => {
                return player.megaCreditProduction;
            };
        }
        // Most science tags in play
        else if (award === Award.SCIENTIST) {
            getScore = (player: Player) => {
                return player.getTagCount(Tags.SCIENCE);
            };
        }
        // Most heat resources
        else if (award === Award.THERMALIST) {
            getScore = (player: Player) => {
                return player.heat;
            };
        }
        // Most STEEL and TITANIUM resources
        else if (award === Award.MINER) {
            getScore = (player: Player) => {
                return player.steel + player.titanium;
            };
        } else {
            throw "Unsupported award " + award;
        }
        players.sort((player1, player2) => getScore(player2) - getScore(player1));
        if (players.length <= 2) {
            players[0].victoryPoints += 5;
        } else if (getScore(players[0]) === getScore(players[1])) {
            players[0].victoryPoints += 5;
            players[1].victoryPoints += 5;
        } else {
            players[0].victoryPoints += 5;
            players[1].victoryPoints += 2;
        }
    }

    public hasBeenFunded(award: Award): boolean {
        return this.fundedAwards.filter((fundedAward) => fundedAward === award).length > 0;
    }

    public allAwardsFunded(): boolean {
        return this.fundedAwards.length > 2;
    }

    public allMilestonesClaimed(): boolean {
        return this.claimedMilestones.length > 2;
    }

    private pickCorporationCard(player: Player): PlayerInput {
        return new AndOptions(
            () => {
                player.corporationCard!
                    .play(player, this)
                    .then(() => {
                        this.playerIsFinishedWithResearchPhase(player);
                    });
            },
            new SelectCard<CorporationCard>("Initial Research Phase", "Select corporation", this.dealer.getCorporationCards(2), (foundCards: Array<CorporationCard>) => {
                player.corporationCard = foundCards[0];
            }),
            new SelectCard("Initial Research Phase", "Select initial cards to buy", this.dealer.getCards(10), (foundCards: Array<IProjectCard>) => {
                // Pay for cards
                player.megaCredits = player.corporationCard!.startingMegaCredits - (3 * foundCards.length);
                for (let foundCard of foundCards) {
                    player.cardsInHand.push(foundCard);
                }
            }, 10, 0)
        );
    }
 
    private passedPlayers: Set<Player> = new Set<Player>();

    private hasPassedThisActionPhase(player: Player): boolean {
        return this.passedPlayers.has(player);
    }

    private incrementFirstPlayer(): void {
        let firstIndex: number = this.players.indexOf(this.first);
        if (firstIndex === -1) {
            throw "Didn't even find player";
        }
        if (firstIndex === this.players.length - 1) {
            firstIndex = 0;
        } else {
            firstIndex++;
        }
        this.first = this.players[firstIndex];
    }

    public phase: Phase = Phase.RESEARCH;

    private dealEachPlayer4Cards(): void {
        this.players.forEach((player) => {
            player.runResearchPhase(this);
        });
    }

    private gotoResearchPhase(): void {
        this.generation++;
        this.incrementFirstPlayer();
        this.dealEachPlayer4Cards();
    }

    private gotoProductionPhase(): void {
        this.passedPlayers.clear();
        this.players.forEach((player) => {
            player.runProductionPhase();
        });
        this.gotoResearchPhase();
    }

    private allPlayersHavePassed(): boolean {
        for (const player of this.players) {
            if (!this.hasPassedThisActionPhase(player)) {
                return false;
            }
        }
        return true;
    }

    public playerHasPassed(player: Player): void {
        this.passedPlayers.add(player);
        if (this.allPlayersHavePassed()) {
            this.gotoProductionPhase();
        } else {
            this.playerIsFinishedTakingActions(player);
        }
    }

    private hasResearched(player: Player): boolean {
        return this.researchedPlayers.has(player);
    }

    private researchedPlayers: Set<Player> = new Set<Player>();

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
        // Greenery must be placed by a space you own if you own a space
        if (this.getSpaces(SpaceType.LAND).find((space) => space.tile !== undefined && space.player === player)) {
            return this.getAvailableSpacesOnLand(player)
                                .filter((space) => this.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.player === player).length > 0);
        }
        // Place anywhere
        return this.getAvailableSpacesOnLand(player);
    }

    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
        return this.getSpaces(SpaceType.LAND)
                .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
    }

    public getAvailableSpacesForOcean(player: Player): Array<ISpace> {
        return this.getSpaces(SpaceType.OCEAN)
                .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
    }

    private allPlayersHaveFinishedResearch(): boolean {
        for (const player of this.players) {
            if (!this.hasResearched(player)) {
                return false;
            }
        }
        return true;
    }

    public playerIsFinishedWithResearchPhase(player: Player): void {
        this.researchedPlayers.add(player);
        if (this.allPlayersHaveFinishedResearch()) {
            this.gotoActionPhase();
        }
    }

    public playerIsFinishedTakingActions(player: Player): void {

        let nextStartIndex: number = -1;

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] === player) {
                nextStartIndex = i + 1;
                break;
            }
        }

        if (nextStartIndex === -1) {
            throw "Did not find player";
        }

        if (nextStartIndex + 1 >= this.players.length) {
            nextStartIndex = 0;
        }

        for (let i = nextStartIndex; i < this.players.length; i++) {
            if (!this.hasPassedThisActionPhase(this.players[i])) {
                this.startActionsForPlayer(this.players[i]);
                break;
            }
        }

    }

    private gotoActionPhase(): void {
        this.phase = Phase.ACTION;
        this.passedPlayers.clear();
        this.startActionsForPlayer(this.first);
    }

    private startActionsForPlayer(player: Player) {
        this.activePlayer = player;
        player.takeAction(this);
    }

    public dealer: Dealer = new Dealer();
    private spaces: Array<ISpace> = new OriginalBoard().spaces;
    private onGreeneryPlaced: Array<Function> = [];
    private onCityTilePlaced: Array<(space: ISpace) => void> = [];
    private onOceanTilePlaced: Array<Function> = [];
    public addGreeneryPlacedListener(listener: Function): void {
        this.onGreeneryPlaced.push(listener);
    }
    public addCityTilePlacedListener(listener: (space: ISpace) => void): void {
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
        if (this.temperature < constants.MAX_TEMPERATURE) {
            // BONUS FOR HEAT PRODUCTION AT -20 and -24
            // BONUS FOR OCEAN TILE AT 0
            if (this.temperature + 2 === -24 || this.temperature + 2 === -20) {
                player.heatProduction++;
                this.temperature += 2;
                return Promise.resolve();
            } else if (this.temperature + 2 === 0) {
                return new Promise((resolve, reject) => {
                    player.setWaitingFor(new SelectSpace("Temperature Bonus", "Select space for ocean", this.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        try { this.addOceanTile(player, space.id); }
                        catch (err) { reject(err); return; }
                        this.temperature += 2
                        resolve();
                    }));
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

    public getGeneration(): number {
        return this.generation;
    }

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
    public getAllSpaces(): Array<ISpace> {
        return this.spaces;
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
    public getSpaceCount(tileType: TileType, player: Player): number {
        return this.spaces.filter((space) => space.tile !== undefined && space.tile.tileType === tileType && space.player !== undefined && space.player === player).length;
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
        const space = this.getSpace(spaceId);
        this.addTile(player, SpaceType.LAND, space, { tileType: TileType.CITY });
        this.onCityTilePlaced.forEach((fn: (space: ISpace) => void) => {
            fn(space);
        });
    }
    public addOceanTile(player: Player, spaceId: string): void {
        if (this.getOceansOnBoard() - 1 === constants.MAX_OCEAN_TILES) {
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

