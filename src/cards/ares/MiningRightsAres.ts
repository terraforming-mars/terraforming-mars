import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningRights } from "../MiningRights";

export class MiningRightsAres extends MiningRights {
  public name: CardName = CardName.MINING_RIGHTS_ARES;

  protected addAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
    space.adjacency = { bonus: [bonusType] };
  }
}
