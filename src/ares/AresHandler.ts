// Game.ts-specific behavior for Ares

import { CardName } from "../CardName";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { ISpace } from "../ISpace";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { LogMessageType } from "../LogMessageType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { ResourceType } from "../ResourceType";
import { SpaceBonus } from "../SpaceBonus";
import { AresSpaceBonus } from "./AresSpaceBonus";
import { TileType } from "../TileType";
import { ITile } from "../ITile";
import { IAresData, IHazardConstraint, IMilestoneCount } from "./IAresData";
import { IAdjacencyCost } from "./IAdjacencyCost";
import { SelectProductionToLoseInterrupt } from "../interrupts/SelectProductionToLoseInterrupt";
import { ARES_MILESTONES } from "../milestones/Milestones";
import { ARES_AWARDS } from "../awards/Awards";

export const OCEAN_UPGRADE_TILES = [TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY];
export const HAZARD_TILES = [TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE, TileType.EROSION_MILD, TileType.EROSION_SEVERE];

export class AresHandler {
    private constructor() {}

    public static isAresSpaceBonus(a: SpaceBonus | AresSpaceBonus): a is AresSpaceBonus {
        switch (a) {
            case AresSpaceBonus.ANIMAL:
            case AresSpaceBonus.MEGACREDITS:
            case AresSpaceBonus.MICROBE:
            case AresSpaceBonus.POWER:
                return true;
        }
        return false;
    }

    public static initialData(active: boolean, includeHazards: boolean, players: Player[]): IAresData {
        return {
            active: active,
            includeHazards: includeHazards,
            hazardData: {
                erosionOceanCount: { threshold: 3, available: true }, // oceans: add erosion tiles
                removeDustStormsOceanCount: { threshold: 6, available: true }, // oceans: remove dust storms
                severeErosionTemperature: { threshold: -4, available: true }, // temperatore: severe erosion
                severeDustStormOxygen: { threshold: 5, available: true } // oxygen: severe dust storms
            },
            milestoneResults: players.map(p => {
                return {id: p.id, count: 0};
            })
        };
    }

    public static setupMilestonesAwards(game: Game) {
        game.milestones.push(...ARES_MILESTONES);
        game.awards.push(...ARES_AWARDS)
    }

    public static earnAdjacencyBonuses(game: Game, player: Player, space: ISpace) {
        var incrementMilestone = false;

        game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
            if (this.earnAdacencyBonus(game, adjacentSpace, player)) {
                incrementMilestone = true;
            }
        });
        if (incrementMilestone) {
            var milestoneResults = game.aresData!.milestoneResults;
            var entry : IMilestoneCount | undefined = milestoneResults.find(e => e.id === player.id);
            if (entry === undefined) {
                throw new Error("Player ID not in the Ares milestone results map: " + player.id);
            }
            entry.count++;
        }
    }
    // |player| placed a tile next to |adjacentSpace|.
    // Returns true if the adjacent space contains a bonus for adjacency.
    public static earnAdacencyBonus(game: Game, adjacentSpace: ISpace, player: Player): boolean {
        if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
            return false;
        }
        if (!adjacentSpace.player) {
            throw new Error(`A tile with an adjacency bonus must have an owner (${adjacentSpace.x}, ${adjacentSpace.y}, ${adjacentSpace.adjacency.bonus}`);
        }

        var addResourceToCard = function(game: Game, player: Player, resourceType: ResourceType, resourceAsText: string) {
        const availableCards = player.getResourceCards(resourceType);
        if (availableCards.length === 0) {
        } else if (availableCards.length === 1) {
            player.addResourceTo(availableCards[0]);
        } else if (availableCards.length > 1) {
            game.addInterrupt({
            player: player,
            playerInput:
                new SelectCard(
                "Select a card to add an " + resourceAsText,
                "Add " + resourceAsText + "s",
                availableCards,
                (selected: ICard[]) => {
                    player.addResourceTo(selected[0]);
                    LogHelper.logAddResource(game, player, selected[0], 1);
                    return undefined;
                })
            });
        }
        };
    
        adjacentSpace.adjacency.bonus.forEach(bonus => {
            if (AresHandler.isAresSpaceBonus(bonus)) {
                // TODO(kberg): group and sum. Right now cards only have one animal to place, so this isn't
                // a problem.
                switch(bonus) {
                case AresSpaceBonus.ANIMAL:
                    addResourceToCard(game, player, ResourceType.ANIMAL, "animal");
                    break;

                case AresSpaceBonus.MEGACREDITS:
                    player.megaCredits++;
                    break;

                case AresSpaceBonus.POWER:
                    player.energy++;
                    break;

                case AresSpaceBonus.MICROBE:
                    addResourceToCard(game, player, ResourceType.MICROBE, "microbe");
                    break;
                }
            } else {
                game.grantSpaceBonus(player, bonus);
            }
            game.newLog("${0} gains 1 ${1} for placing next to ${2}",
                b => b.player(player).string(bonusAsString(bonus)).string(tileTypeAsString(adjacentSpace.tile?.tileType)));

            var ownerBonus = 1;
            if (adjacentSpace.player) {
                if (adjacentSpace.player.playedCards.find(card => card.name === CardName.MARKETING_EXPERTS)) {
                    ownerBonus = 2;
                };
                
                adjacentSpace.player.megaCredits += ownerBonus;
                game.newLog("${0} gains ${1} M€ for a tile placed next to ${2}", b => b.player(adjacentSpace.player!).string(ownerBonus.toString()).string(tileTypeAsString(adjacentSpace.tile?.tileType)));
            }
        });
        return true;
    }

    private static isMild(tile: ITile): boolean {
        if (tile.tileType === TileType.DUST_STORM_MILD || tile.tileType === TileType.EROSION_MILD) {
            return true;
        }
        if (tile.tileType === TileType.DUST_STORM_SEVERE || tile.tileType === TileType.EROSION_SEVERE) {
            return false;
        }
        throw new Error("Not a hazard tile: " + tile.tileType);
    }

    private static computeAdjacencyCosts(game: Game, space: ISpace): IAdjacencyCost {
        // Summing up production cost isn't really the way to do it, because each tile could
        // reduce different production costs. Oh well.
        var megaCreditCost = 0;
        var productionCost = 0;
        game.board.getAdjacentSpaces(space).forEach(adjacentSpace => {
          megaCreditCost += adjacentSpace.adjacency?.cost || 0;
          if (adjacentSpace.tile?.hazard === true) {
            productionCost += this.isMild(adjacentSpace.tile) ? 1 : 2;
          }
        });

        if (space.tile?.hazard) {
            megaCreditCost += AresHandler.isMild(space.tile) ? 8 : 16;
        }

        return { megacredits: megaCreditCost, production: productionCost };
    }

    public static assertCanPay(game: Game, player: Player, space: ISpace): IAdjacencyCost {
        var cost = AresHandler.computeAdjacencyCosts(game, space);

        // Make this more sophisticated, a player can pay for different adjacencies
        // with different production units, and, a severe hazard can't split payments.
        var avaialbleProductionUnits = (player.getProduction(Resources.MEGACREDITS) + 5)
            + player.getProduction(Resources.STEEL)
            + player.getProduction(Resources.TITANIUM)
            + player.getProduction(Resources.PLANTS)
            + player.getProduction(Resources.ENERGY)
            + player.getProduction(Resources.HEAT);

        if (avaialbleProductionUnits >= cost.production && player.canAfford(cost.megacredits)) {
           return cost;
        } 
        if (cost.production > 0) {
            throw new Error(`Placing here costs ${cost.production} units of production and ${cost.megacredits} M€`);
        } else {
            throw new Error(`Placing here costs ${cost.megacredits} M€`);
        }
    }

    public static payAdjacencyAndHazardCosts(game: Game, player: Player, space: ISpace) {

        var cost = this.assertCanPay(game, player, space);

        if (cost.production > 0) {
            // TODO(kberg): don't send interrupt if total is available.
            game.addInterrupt(new SelectProductionToLoseInterrupt(player, cost.production));
        }
        if (cost.megacredits > 0) {
            game.newLog("${0} placing a tile here costs ${1} M€", b => b.player(player).number(cost.megacredits));

            game.addSelectHowToPayInterrupt(player, cost.megacredits, false, false, "Select how to pay additional placement costs.");
        }
    }

    private static countResources(player: Player, resourceType: ResourceType): number {
        let count = player.playedCards
            .map((c) => resourceType === c.resourceType ? c.resourceCount || 0 : 0)
            .reduce((prior, current) => prior + current, 0);

        if (resourceType === player.corporationCard?.resourceType) {
            count += player.corporationCard.resourceCount || 0;
        }
        return count;
    }

    // Returns a map of resources and resource types to track, and the current count
    // of each of these |player| has. Used with |rewardForPlacement|.
    //
    // This feature is part of Ecological Survey and Geological Survey.
    //
    public static beforeTilePlacement(player: Player): Map<Resources | ResourceType, number> {
      var map: Map<Resources | ResourceType, number> = new Map();
      if (player.playedCards.find((c) => c.name === CardName.ECOLOGICAL_SURVEY)) {
          map.set(Resources.PLANTS, player.getResource(Resources.PLANTS));
          map.set(ResourceType.ANIMAL, AresHandler.countResources(player, ResourceType.ANIMAL));
          map.set(ResourceType.MICROBE, AresHandler.countResources(player, ResourceType.MICROBE));
      }
      if (player.playedCards.find((c) => c.name === CardName.GEOLOGICAL_SURVEY)) {
          map.set(Resources.STEEL, player.getResource(Resources.STEEL));
          map.set(Resources.TITANIUM, player.getResource(Resources.TITANIUM));
          map.set(Resources.HEAT, player.getResource(Resources.HEAT));
      }
      return map;
    }

    // Used with Ecological and Geological Survey
    public static afterTilePlacement(game: Game, player: Player, startingResources?: Map<Resources | ResourceType, number>): void {
        if (!startingResources) {
            return;
        }

        function giveBonus(start: number | undefined, current: number): boolean {
            return start !== undefined && current > start;
        }

        // Although this bit of code goes through all six resource types, the expected input map will only contain
        // the three (or six) resources it is tracking.
        [Resources.PLANTS, Resources.STEEL, Resources.TITANIUM, Resources.HEAT].forEach((resource) => {
            if (giveBonus(startingResources.get(resource), player.getResource(resource))) {
                player.setResource(resource, 1);

                var cardName = resource === Resources.PLANTS ? CardName.ECOLOGICAL_SURVEY : CardName.GEOLOGICAL_SURVEY;
                game.newLog("${0} gained a bonus ${1} because of ${2}", b => b.player(player).string(resource).cardName(cardName));
            }
        });
        [ResourceType.MICROBE, ResourceType.ANIMAL].forEach((resourceType) => {
            if (giveBonus(startingResources.get(resourceType), AresHandler.countResources(player, resourceType))) {
                game.addSelectResourceCardInterrupt(
                    player,
                    1,
                    resourceType,
                    player.getResourceCards(resourceType)
                );
            }
        });
    }

    public static setupHazards(game: Game, playerCount: number) {
        // The number of dust storms depends on the player count.
        // I made up that the solo player has 3 dust storms. The rules
        // don't take solo into account, nor if you played with more than
        // five players.
        if (playerCount >= 5) {
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
        } else if (playerCount === 4) {
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
        } else if (playerCount <= 3) {
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
            randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
        }
    }

    public static onTemperatureChange(game: Game) {
        // This will have no effect if the erosions don't exist, but that's OK --
        // the check for placing erosions will take this into account.
        testConstraint(
            game.aresData!.hazardData.severeErosionTemperature,
            game.getTemperature(),
            () => { makeSevere(game, TileType.EROSION_MILD, TileType.EROSION_SEVERE); }
        );
    }

    public static onOceanPlaced(game: Game, player: Player, isWorldGov: boolean) {
        testToPlaceErosionTiles(game, player);
        testToRemoveDustStorms(game, player, isWorldGov);
    }

    public static onOxygenChange(game: Game) {
        testConstraint(game.aresData!.hazardData.severeDustStormOxygen, game.getOxygenLevel(), () => {
            makeSevere( game, TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE);
            });
    }

    // Returns true if |newTile| can cover |boardTile|.
    public static canCover(space: ISpace, newTile: ITile): boolean {
        if (space.tile === undefined) {
            return true;
        }

        // A hazard with a player's token on it used Desperate measures.
        if (space.tile.hazard && hasDesperateMeasuresMarker(space) === false) {
            return true;
        } else if (space.tile.tileType === TileType.OCEAN && OCEAN_UPGRADE_TILES.includes(newTile.tileType)) {
            return true;
        }
        return false;
    }

    public static grantBonusForRemovingHazard(game: Game, player: Player, initialTileType?: TileType) {
        var steps: number;
        switch (initialTileType) {
            case TileType.DUST_STORM_MILD:
            case TileType.EROSION_MILD:
                steps = 1;
                break;

            case TileType.DUST_STORM_SEVERE:
            case TileType.EROSION_SEVERE:
                steps = 2;
                break;
        
            default:
                return;
        }
        player.increaseTerraformRatingSteps(steps, game);
        game.newLog("${0}'s TR increases ${1} step(s) for removing ${2}", b => b.player(player).number(steps).string(tileTypeAsString(initialTileType)));
    }

    public static putHazardAt(space: ISpace, tileType: TileType) {
        space.player = undefined;
        space.tile = { tileType: tileType, hazard: true };
    }
}

function randomlyPlaceHazard(game: Game, tileType: TileType, direction: 1 | -1) {
    var card = game.dealer.dealCard();
    game.newLog("Dealt and discarded ${0} (cost ${1}) to place a hazard", b => b.card(card).number(card.cost));

    var distance = card.cost - 1;
    distance = Math.max(distance, 0); // Some cards cost zero.
    var space = game.board.getAvailableSpaceByOffset(distance, direction);
    if (space === undefined) {
        throw new Error("Couldn't find space when card cost is " + card.cost);
    }
    AresHandler.putHazardAt(space, tileType);
    return space;
}

function makeSevere(game: Game, from: TileType, to: TileType) {
    game.board.spaces
        .filter((s) => s.tile?.tileType === from)
        .forEach((s) => {
            AresHandler.putHazardAt(s, to);
        });

    game.newLog("${0} have upgraded to ${1}", b => b.string(tileTypeAsString(from)).string(tileTypeAsString(to)));
}

function testConstraint(constraint: IHazardConstraint, testValue: number, cb: () => void) {
    if (!constraint.available) {
        return;
    }
    if (testValue >= constraint.threshold) {
        cb();
        constraint.available = false;
    }
}

function testToRemoveDustStorms(game: Game, player: Player, isWorldGov: boolean) {
    testConstraint(
        game.aresData!.hazardData.removeDustStormsOceanCount,
        game.board.getOceansOnBoard(),
        () => {
            game.board.spaces.forEach((space) => {
                if (space.tile?.tileType === TileType.DUST_STORM_MILD || space.tile?.tileType === TileType.DUST_STORM_SEVERE) {
                    if (!hasDesperateMeasuresMarker(space)) {
                        space.tile = undefined;
                    }
                }
            });

            if (!isWorldGov) {
                player.increaseTerraformRating(game);
                game.newLog("${0}'s TR increases 1 step for eliminating dust storms.", b => b.player(player));
            }
        }
    );
}

function testToPlaceErosionTiles(game: Game, player: Player) {
    testConstraint(
        game.aresData!.hazardData.erosionOceanCount,
        game.board.getOceansOnBoard(),
        () => {
            let type = TileType.EROSION_MILD;
            if (game.aresData!.hazardData.severeErosionTemperature.available !== true) {
                type = TileType.EROSION_SEVERE;
            }

            var space1 = randomlyPlaceHazard(game, type, 1);
            var space2 = randomlyPlaceHazard(game, type, -1);
            [space1, space2].forEach((space) => {
                LogHelper.logTilePlacement(game, player, space, type);
            });
        }
    );
}

function hasDesperateMeasuresMarker(space: ISpace): boolean {
    if (space.player) {
      if (space.tile && space.tile.hazard && space.tile.hazard === true) {
          return true;
      }
    }
    return false;
}

// TODO(kberg): convert to a log message type
const tileTypeToStringMap: Map<TileType, string> = new Map([
    [TileType.GREENERY, "greenery"],
    [TileType.OCEAN, "ocean"],
    [TileType.CITY, "city"],

    [TileType.CAPITAL, CardName.CAPITAL],
    [TileType.COMMERCIAL_DISTRICT, CardName.COMMERCIAL_DISTRICT],
    [TileType.ECOLOGICAL_ZONE, CardName.ECOLOGICAL_ZONE],
    [TileType.INDUSTRIAL_CENTER, CardName.INDUSTRIAL_CENTER],
    [TileType.LAVA_FLOWS, CardName.LAVA_FLOWS],
    [TileType.MINING_AREA, CardName.MINING_AREA],
    [TileType.MINING_RIGHTS, CardName.MINING_RIGHTS],
    [TileType.MOHOLE_AREA, CardName.MOHOLE_AREA],
    [TileType.NATURAL_PRESERVE, CardName.NATURAL_PRESERVE],
    [TileType.NUCLEAR_ZONE, CardName.NUCLEAR_ZONE],
    [TileType.RESTRICTED_AREA, CardName.RESTRICTED_AREA],

    // DEIMOS_DOWN, "",
    // GREAT_DAM, "",
    // MAGNETIC_FIELD_GENERATORS, "",

    [TileType.BIOFERTILIZER_FACILITY, CardName.BIOFERTILIZER_FACILITY],
    [TileType.METALLIC_ASTEROID, CardName.METALLIC_ASTEROID],
    [TileType.SOLAR_FARM, CardName.SOLAR_FARM],
    [TileType.OCEAN_CITY, CardName.OCEAN_CITY],
    [TileType.OCEAN_FARM, CardName.OCEAN_FARM],
    [TileType.OCEAN_SANCTUARY, CardName.OCEAN_SANCTUARY],
    [TileType.DUST_STORM_MILD, "Mild Dust Storm"],
    [TileType.DUST_STORM_SEVERE, "Severe Dust Storm"],
    [TileType.EROSION_MILD, "Mild Erosion"],
    [TileType.EROSION_SEVERE, "Severe Erosion"],
    [TileType.MINING_STEEL_BONUS, "Mining (Steel)"],
    [TileType.MINING_TITANIUM_BONUS, "Mining (Titanium)"],
]);

function tileTypeAsString(tileType: TileType | undefined): string {
    if (tileType === undefined) { return "undefined" };
    return tileTypeToStringMap.get(tileType)|| "special";
}


const bonusToStringMap: Map<SpaceBonus, string> = new Map([
    [SpaceBonus.TITANIUM, "Titanium"],
    [SpaceBonus.STEEL, "Steel"],
    [SpaceBonus.PLANT, "Plant"],
    [SpaceBonus.DRAW_CARD, "Card"],
    [SpaceBonus.HEAT, "Heat"],
    [SpaceBonus.OCEAN, "Ocean"],
]);

const spaceBonusToStringMap: Map< AresSpaceBonus, string> = new Map([
    [AresSpaceBonus.MEGACREDITS, "MC"],
    [AresSpaceBonus.ANIMAL, "Animal"],
    [AresSpaceBonus.MICROBE, "Microbe"],
    [AresSpaceBonus.POWER, "Power"],
]);

function bonusAsString(bonus: SpaceBonus | AresSpaceBonus | undefined): string {
    if (bonus === undefined) { return "undefined" };
    if (AresHandler.isAresSpaceBonus(bonus)) {
        return spaceBonusToStringMap.get(bonus)|| "special";
    }
    return bonusToStringMap.get(bonus)|| "special";
}

