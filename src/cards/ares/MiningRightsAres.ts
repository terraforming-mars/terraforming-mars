import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningRights } from "../MiningRights";
import { TileType } from "../../TileType";

export class MiningRightsAres extends MiningRights {
  public name: CardName = CardName.MINING_RIGHTS_ARES;

  // TODO(kberg): remove duplication with MiningAreaAres.
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
