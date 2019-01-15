
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { SpaceType } from "../SpaceType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { TileType } from "../TileType";
import { Tags } from "./Tags";

export class LavaFlows implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [];
    public name: string = "Lava Flows";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 2 steps and place this tile on either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons";
    public description: string = "Releasing tremendous lava flows from one of Mars' gargantuan volcanoes";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: SpaceName) => {
                if (spaceId !== SpaceName.THARSIS_THOLUS && spaceId !== SpaceName.ASCRAEUS_MONS && spaceId !== SpaceName.PAVONIS_MONS && spaceId !== SpaceName.ARSIA_MONS) {
                    reject("Must select either tharsis tholus, ascraeus mons, pavonis mons or arsia mons");
                    return;
                }
                try { game.addTile(player, SpaceType.COLONY, game.getSpace(spaceId as string), { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                return game.increaseTemperature(player).then(function () { return game.increaseTemperature(player); });
            });
        });
    }
}

