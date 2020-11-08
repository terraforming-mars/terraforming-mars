import { CardName } from "../../CardName";
import { SpaceBonus } from "../../SpaceBonus";
import { LavaFlows } from "../LavaFlows";
import { IAdjacencyBonus } from "../../ares/IAdjacencyBonus";

export class LavaFlowsAres extends LavaFlows {
  public name = CardName.LAVA_FLOWS_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]}
}
