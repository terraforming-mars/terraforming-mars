import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningRights } from "../MiningRights";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";

export class MiningRightsAres extends MiningRights {
  public name: CardName = CardName.MINING_RIGHTS_ARES;

  protected addAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
    space.adjacency = { bonus: AdjacencyBonus.ofSpaceBonus(1, bonusType)};
  }
}
