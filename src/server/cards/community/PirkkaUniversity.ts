import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {CardRenderer} from '../render/CardRenderer';
import { CardResource } from '@/common/CardResource';
import { ActionCard } from '../ActionCard';

export class PirkkaUniversity extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PIRKKA_UNIVERSITY,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 8,
      victoryPoints: 1,
      action: {
        drawCard: {count: 1},
      },

      metadata: {
        cardNumber: 'M6',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw one card, discard one card', (eb) => {
            eb.startAction.cards(1).slash().minus().cards(1)
          });
        }),
      },
    });
  }

  public override bespokeAction(player: IPlayer) {
    player.defer(() => {
        // No card to discard
        if (player.cardsInHand.length === 0) {
          return undefined;
        }
        return new OrOptions(
          new SelectCard('Select a card to discard', 'Discard', player.cardsInHand)
            .andThen(([card]) => {
              player.game.log('${0} is using their ${1} effect to draw a card by discarding a card.', (b) => b.player(player).card(this));
              player.discardCardFromHand(card, {log: true});
              return undefined;
            }),
          new SelectOption('Do nothing'),
        );
      },
      Priority.DISCARD_CARDS);
      return undefined;
  }
  
}
