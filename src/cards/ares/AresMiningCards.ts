import { ITile } from "../../ITile";
import { SpaceBonus } from "../../SpaceBonus";
import { TileType } from "../../TileType";

export class AresMiningCards {
    public static setTileType(tile: ITile, bonusType: SpaceBonus.STEEL | SpaceBonus.TITANIUM) {
        tile.tileType = (bonusType === SpaceBonus.STEEL) ? TileType.MINING_STEEL_BONUS : TileType.MINING_TITANIUM_BONUS;
    }
}