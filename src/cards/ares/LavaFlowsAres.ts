import { CardName } from "../../CardName";
import { SpaceBonus } from "../../SpaceBonus";
import { LavaFlows } from "../LavaFlows";
import { AdjacencyBonus } from "../../ares/AdjacencyBonus";

export class LavaFlowsAres extends LavaFlows {
  public name: CardName = CardName.LAVA_FLOWS_ARES;
  public adjacencyBonus: AdjacencyBonus = AdjacencyBonus.ofSpaceBonus(2, SpaceBonus.HEAT);
}
