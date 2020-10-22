import { CardName } from "../CardName";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { ISpace } from "../ISpace";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";
import { SpaceBonus } from "../SpaceBonus";
import { TileType } from "../TileType";
import { Multiset } from "../utils/Multiset";
// import { IMilestoneCount } from "./IAresData";

export enum HazardSeverity {
    NONE,
    MILD,
    SEVERE
};

export class AresHandler {
    private constructor() {}

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
        if (!adjacentSpace.player) {
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
        if (adjacentSpace.player.cardIsInEffect(CardName.MARKETING_EXPERTS)) {
            ownerBonus = 2;
        };
        
        adjacentSpace.player.megaCredits += ownerBonus;
        game.log("${0} gains ${1} M€ for a tile placed next to ${2}", b => b.player(adjacentSpace.player!).number(ownerBonus).string(tileText));

        return true;
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
