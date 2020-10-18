import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningArea } from "../MiningArea";
import { AresMiningCards } from "./AresMiningCards";

export class MiningAreaAres extends MiningArea {
  public name: CardName = CardName.MINING_AREA_ARES;

  protected setAdjacencyBonus(space: ISpace, bonusType: SpaceBonus.STEEL | SpaceBonus.TITANIUM) {
    space.adjacency = { bonus: [bonusType] };
      // TODO(kberg): this pattern will repeat. Move something to AresHandler.
      if (space.tile) {
          AresMiningCards.setTileType(space.tile, bonusType);
      } else {
          console.log("Assertion failure: " + space.id + " is expected to have a tile.")
      }
}
}
