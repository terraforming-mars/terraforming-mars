import { CardName } from "../../CardName";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { MiningRights } from "../MiningRights";
import { AresMiningCards } from "./AresMiningCards";

export class MiningRightsAres extends MiningRights {
    public name: CardName = CardName.MINING_RIGHTS_ARES;

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
