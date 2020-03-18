import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from '../../CardName';

export class TradeEnvoys implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.TRADE_ENVOYS;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
        player.colonyTradeOffset++;
      return undefined;
    }
}
