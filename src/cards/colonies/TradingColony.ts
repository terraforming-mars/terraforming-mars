import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class TradingColony implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.TRADING_COLONY;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, false, "Select colony for Trading Colony");
      player.colonyTradeOffset++; 
      return undefined;
    }
}