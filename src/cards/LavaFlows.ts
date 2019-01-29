
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { SpaceType } from "../SpaceType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { TileType } from "../TileType";
import { Tags } from "./Tags";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class LavaFlows implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [];
    public name: string = "Lava Flows";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 2 steps and place this tile on either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons";
    public description: string = "Releasing tremendous lava flows from one of Mars' gargantuan volcanoes";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons", (space: ISpace) => {
                if (space.id !== SpaceName.THARSIS_THOLUS && space.id !== SpaceName.ASCRAEUS_MONS && space.id !== SpaceName.PAVONIS_MONS && space.id !== SpaceName.ARSIA_MONS) {
                    reject("Must select either tharsis tholus, ascraeus mons, pavonis mons or arsia mons");
                    return undefined;
                }
                try { game.addTile(player, SpaceType.LAND, space, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return undefined; }
                return game.increaseTemperature(player)
                        .then(function () { return game.increaseTemperature(player); })
                        .then(function () { resolve(); })
                        .catch(function (err: string) { reject(err); });
            }));
        });
    }
}

