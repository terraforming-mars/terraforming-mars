
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
    private getAvailableSpaces(game: Game): Array<ISpace> {
        return game.getSpaces(SpaceType.LAND)
                .filter((space) => space.id === SpaceName.THARSIS_THOLUS || space.id === SpaceName.ASCRAEUS_MONS || space.id === SpaceName.ARSIA_MONS);
    }
    public play(player: Player, game: Game) {
        if (this.getAvailableSpaces(game).length === 0) {
            throw "Spaces are not available to play card";
        }
        return new SelectSpace(this.name, "Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons", this.getAvailableSpaces(game), (space: ISpace) => {
            game.addTile(player, SpaceType.LAND, space, { tileType: TileType.SPECIAL });
            return game.increaseTemperature(player, 2);
        });
    }
}

