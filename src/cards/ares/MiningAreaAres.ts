import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { TileType } from "../../TileType";
import { MiningArea } from "../MiningArea";

export class MiningAreaAres extends MiningArea {
  public name: CardName = CardName.MINING_AREA_ARES;

  protected setAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
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
