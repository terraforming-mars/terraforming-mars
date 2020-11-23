import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {IProjectCard} from './IProjectCard';
import {IActionCard} from './ICard';
import {CardName} from '../CardName';
import {LogHelper} from '../components/LogHelper';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';

export class InventorsGuild implements IActionCard, IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE];
    public name = CardName.INVENTORS_GUILD;
    public cardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      const dealtCard = game.dealer.dealCard();
      const canSelectCard = player.canAfford(player.cardCost);
      return new SelectCard(
        canSelectCard ? 'Select card to keep or none to discard' : 'You cannot pay for this card',
        'Save',
        [dealtCard],
        (cards: Array<IProjectCard>) => {
          if (cards.length === 0 || !canSelectCard) {
            LogHelper.logCardChange(game, player, 'discarded', 1);
            game.dealer.discard(dealtCard);
            return undefined;
          }
          LogHelper.logCardChange(game, player, 'drew', 1);
          player.cardsInHand.push(dealtCard);
          game.defer(new SelectHowToPayDeferred(player, player.cardCost, false, false, 'Select how to pay for action'));
          return undefined;
        }, canSelectCard ? 1 : 0, 0,
      );
    }
}
