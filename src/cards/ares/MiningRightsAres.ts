import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningRights } from "../MiningRights";
import { AresCardHelper } from "./AresCardHelper";

export class MiningRightsAres extends MiningRights {
  public name: CardName = CardName.MINING_RIGHTS_ARES;

  protected setAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
    AresCardHelper.setAdjacencyBonus(space, bonusType);
  }
}
