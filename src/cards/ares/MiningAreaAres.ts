import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningArea } from "../MiningArea";
import { AresCardHelper } from "./AresCardHelper";

export class MiningAreaAres extends MiningArea {
  public name: CardName = CardName.MINING_AREA_ARES;

  protected setAdjacencyBonus(space: ISpace, bonusType: SpaceBonus) {
    AresCardHelper.setAdjacencyBonus(space, bonusType);
  }
}
