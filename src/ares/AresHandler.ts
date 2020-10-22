import { CardName } from "../CardName";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { ISpace } from "../ISpace";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { ResourceType } from "../ResourceType";
import { SpaceBonus } from "../SpaceBonus";
import { TileType } from "../TileType";
import { ITile } from "../ITile";
import { IAresData } from "./IAresData";
import { IAdjacencyCost } from "./IAdjacencyCost";
// import { SelectProductionToLoseInterrupt } from "../interrupts/SelectProductionToLoseInterrupt";
// import { ARES_MILESTONES } from "../milestones/Milestones";
// import { ARES_AWARDS } from "../awards/Awards";
import { Multiset } from "../utils/Multiset";
import { Phase } from "../Phase";

export const OCEAN_UPGRADE_TILES = [TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY];
export const HAZARD_TILES = [TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE, TileType.EROSION_MILD, TileType.EROSION_SEVERE];

export enum HazardSeverity {
    NONE,
    MILD,
    SEVERE
};

export class AresHandler {
    private constructor() {}

    public static initialData(active: boolean, includeHazards: boolean, players: Player[]): IAresData {
        return {
            active: active,
            includeHazards: includeHazards,
            hazardData: {
                erosionOceanCount: { threshold: 3, available: true }, // oceans: add erosion tiles
                removeDustStormsOceanCount: { threshold: 6, available: true }, // oceans: remove dust storms
                severeErosionTemperature: { threshold: -4, available: true }, // temperatore: severe erosion
                severeDustStormOxygen: { threshold: 5, available: true }, // oxygen: severe dust storms
            },
            milestoneResults: players.map(p => {
                return {id: p.id, count: 0};
            })
        };
    }

    public static assertHasAres(game: Game) {
        console.assert(game.gameOptions.aresExtension, "Assertion failure: game.gameOptions.aresExtension is not true");
        console.assert(game.aresData !== undefined, "Assertion failure: game.aresData is undefined");
    }

    public static earnAdjacencyBonuses(game: Game, player: Player, space: ISpace) {
        this.assertHasAres(game);

        // let incrementMilestone = false;

        game.board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
            if (this.earnAdacencyBonus(game, adjacentSpace, player)) {
        //     incrementMilestone = true;
            }
        });
        // if (incrementMilestone) {
        //     const milestoneResults = game.aresData!.milestoneResults;
        //     const entry : IMilestoneCount | undefined = milestoneResults.find(e => e.id === player.id);
        //     if (entry === undefined) {
        //         throw new Error("Player ID not in the Ares milestone results map: " + player.id);
        //     }
        //     entry.count++;
        // }
    }

    // |player| placed a tile next to |adjacentSpace|.
    // Returns true if the adjacent space contains a bonus for adjacency.
    private static earnAdacencyBonus(game: Game, adjacentSpace: ISpace, player: Player): boolean {
        this.assertHasAres(game);

        if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
            return false;
        }
        const adjacentPlayer = adjacentSpace.player;
        if (adjacentPlayer === undefined) {
            throw new Error(`A tile with an adjacency bonus must have an owner (${adjacentSpace.x}, ${adjacentSpace.y}, ${adjacentSpace.adjacency.bonus}`);
        }

        const addResourceToCard = function(game: Game, player: Player, resourceType: ResourceType, resourceAsText: string) {
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
    
        const bonuses = new Multiset<SpaceBonus>();

        adjacentSpace.adjacency.bonus.forEach(bonus => {
            bonuses.add(bonus);
            switch(bonus) {
                case SpaceBonus.ANIMAL:
                    addResourceToCard(game, player, ResourceType.ANIMAL, "animal");
                    break;

                case SpaceBonus.MEGACREDITS:
                    player.megaCredits++;
                    break;

                case SpaceBonus.POWER:
                    player.energy++;
                    break;

                case SpaceBonus.MICROBE:
                    addResourceToCard(game, player, ResourceType.MICROBE, "microbe");
                    break;

                default:
                    game.grantSpaceBonus(player, bonus);
                    break;
            }
        });

        const bonusText = bonuses.entries().map((elem) => `${elem[1]} ${bonusAsString(elem[0])}`).join(", ");
        const tileText = tileTypeAsString(adjacentSpace.tile?.tileType);
        game.log("${0} gains ${1} for placing next to ${2}", b => b.player(player).string(bonusText).string(tileText));

        let ownerBonus = 1;
        if (adjacentPlayer.cardIsInEffect(CardName.MARKETING_EXPERTS)) {
            ownerBonus = 2;
        };
        
        adjacentPlayer.megaCredits += ownerBonus;
        game.log("${0} gains ${1} M€ for a tile placed next to ${2}", b => b.player(adjacentPlayer).number(ownerBonus).string(tileText));

        return true;
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

    public static hasHazardTile(space: ISpace): boolean {
        return AresHandler.hazardSeverity(space) !== HazardSeverity.NONE;
    }

    public static hazardSeverity(space: ISpace): HazardSeverity {
        const type = space.tile?.tileType;

        switch(type) {
            case TileType.DUST_STORM_MILD:
            case TileType.EROSION_MILD:
                return HazardSeverity.MILD;

            case TileType.DUST_STORM_SEVERE:
            case TileType.EROSION_SEVERE:
                return HazardSeverity.SEVERE;

            default:
                return HazardSeverity.NONE;
        }
    }

    private static computeAdjacencyCosts(game: Game, space: ISpace): IAdjacencyCost {
        // Summing up production cost isn't really the way to do it, because each tile could
        // reduce different production costs. Oh well.
        let megaCreditCost = 0;
        let productionCost = 0;
        game.board.getAdjacentSpaces(space).forEach(adjacentSpace => {
          megaCreditCost += adjacentSpace.adjacency?.cost || 0;
          const severity = this.hazardSeverity(adjacentSpace);
          switch(severity) {
            case HazardSeverity.MILD:
                productionCost += 1;
                break;
            case HazardSeverity.SEVERE:                  
                productionCost += 2;
                break;
        }});

        const severity = this.hazardSeverity(space);
        switch(severity) {
            case HazardSeverity.MILD:
                megaCreditCost += 8;
                break;
            case HazardSeverity.SEVERE:                  
                megaCreditCost += 16;
                break;
        }

        return { megacredits: megaCreditCost, production: productionCost };
    }

    public static assertCanPay(game: Game, player: Player, space: ISpace): IAdjacencyCost {
        this.assertHasAres(game);
        if (game.phase === Phase.SOLAR) {
            return {megacredits: 0, production: 0 };
        }
        const cost = AresHandler.computeAdjacencyCosts(game, space);

        // Make this more sophisticated, a player can pay for different adjacencies
        // with different production units, and, a severe hazard can't split payments.
        const avaialbleProductionUnits = (player.getProduction(Resources.MEGACREDITS) + 5)
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
        this.assertHasAres(game);

        const cost = this.assertCanPay(game, player, space);

        // if (cost.production > 0) {
        //     // TODO(kberg): don't send interrupt if total is available.
        //     game.addInterrupt(new SelectProductionToLoseInterrupt(player, cost.production));
        // }
        if (cost.megacredits > 0) {
            game.log("${0} placing a tile here costs ${1} M€", b => b.player(player).number(cost.megacredits));

            game.addSelectHowToPayInterrupt(player, cost.megacredits, false, false, "Select how to pay additional placement costs.");
        }
    }

    // Returns true if |newTile| can cover |boardTile|.
    public static canCover(space: ISpace, newTile: ITile): boolean {
        if (space.tile === undefined) {
            return true;
        }

        // A hazard protected by the Desperate Measures action can't be covered.
        if (AresHandler.hasHazardTile(space) && space.tile.protectedHazard !== true) {
            return true;
        }
        if (space.tile.tileType === TileType.OCEAN && OCEAN_UPGRADE_TILES.includes(newTile.tileType)) {
            return true;
        }
        return false;
    }

    public static grantBonusForRemovingHazard(game: Game, player: Player, initialTileType: TileType | undefined) {
        if (game.phase === Phase.SOLAR) {
            return;
        }
        let steps: number;
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
        game.log("${0}'s TR increases ${1} step(s) for removing ${2}", b => b.player(player).number(steps).string(tileTypeAsString(initialTileType)));
    }
    

    public static putHazardAt(space: ISpace, tileType: TileType) {
        space.tile = { tileType: tileType, protectedHazard: false };
    }    
}

function randomlyPlaceHazard(game: Game, tileType: TileType, direction: 1 | -1) {
    const space = game.getSpaceByOffset(direction, "hazard");
    AresHandler.putHazardAt(space, tileType);
    return space;
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
    [SpaceBonus.MEGACREDITS, "MC"],
    [SpaceBonus.ANIMAL, "Animal"],
    [SpaceBonus.MICROBE, "Microbe"],
    [SpaceBonus.POWER, "Power"],
]);

function bonusAsString(bonus: SpaceBonus | undefined): string {
    return (bonus === undefined) ? "undefined" : (bonusToStringMap.get(bonus)|| "special");
}
