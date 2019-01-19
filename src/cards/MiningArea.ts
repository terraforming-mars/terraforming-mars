
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { TileType } from "../TileType";
import { SpaceBonus } from "../SpaceBonus";

export class MiningArea implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Mining Area";
    public text: string = "Place this tile on an area with a steel or titanium placement bonus, adjacent to another of your tiles. Increase your production of that resource 1 step.";
    public description: string = "It is easier to claim territories where you already have established activities.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                const foundSpace = game.getSpace(spaceId);
                if (foundSpace === undefined) {
                    reject("Space not found");
                    return;
                }
                const hasSteelBonus = foundSpace.bonus && foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1;
                const hasTitaniumBonus = foundSpace.bonus && foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1;
                if (!hasSteelBonus && !hasTitaniumBonus) {
                    reject("Space must have steel or titanium placement bonus");
                    return;
                }
                if (game.getAdjacentSpaces(foundSpace).filter((space) => space.player && space.player === player).length === 0) {
                    reject("Tile must be adjacent to one of your tiles");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                if (hasSteelBonus) {
                    player.steelProduction++;
                }
                if (hasTitaniumBonus) {
                    player.titaniumProduction++;
                }
                resolve();
            });
        });
    }
}

