import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { TileType } from "../../TileType";

export class AresCardHelper {
    public static setAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
    space.adjacency = { bonus: [bonusType] };
    switch(bonusType) {
      case SpaceBonus.STEEL:
        space.tile!.tileType = TileType.MINING_STEEL_BONUS;
        break;

    case SpaceBonus.TITANIUM:
      space.tile!.tileType = TileType.MINING_TITANIUM_BONUS;
      break;

    default:
      throw new Error("Bad space bonus type for an Ares mining tile " + bonusType);
    }
  }
}