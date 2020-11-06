import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";

export class TradeEnvoys implements IProjectCard {
    public cost = 6;
    public tags = [];
    public name = CardName.TRADE_ENVOYS;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeOffset++;
      return undefined;
    }
}
