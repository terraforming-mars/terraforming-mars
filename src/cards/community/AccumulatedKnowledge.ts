import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Tags} from '../Tags';
import {DrawCards} from '../../deferredActions/DrawCards';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class AccumulatedKnowledge extends PreludeCard implements IProjectCard {
    public tags = [Tags.SCIENCE];
    public name = CardName.ACCUMULATED_KNOWLEDGE;

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 4));

      game.defer(new DeferredAction(player, () => new OrOptions(
          new SelectCard('Discard a card to draw a card', 'Discard', player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
            game.dealer.discard(foundCards[0]);
            player.cardsInHand.push(game.dealer.dealCard());
            return undefined;
          }),
          new SelectOption('Do nothing', 'Confirm', () => {
            return undefined;
          }),
      )));

      return undefined;
    }
}

