import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { SimpleDeferredAction } from '../../deferredActions/SimpleDeferredAction';

export class ProductiveOutpost implements IProjectCard {
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.PRODUCTIVE_OUTPOST;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.colonies.forEach(colony => {
          colony.colonies.filter(owner => owner === player.id).forEach(owner => {
            // Not using GiveTradeBonus deferred action because it's only for the active player
            game.defer(new SimpleDeferredAction(player, () => colony.giveTradeBonus(game.getPlayerById(owner), game)));
          });
      }); 
      return undefined;
    }
}
