import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {Priority, SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MarsUniversity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARS_UNIVERSITY,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 8,
      victoryPoints: 1,

      metadata: {
        cardNumber: '073',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Science tag, including this, you may discard a card from hand to draw a card.', (eb) => {
            eb.science(1, {played}).startEffect.minus().cards(1).nbsp.plus().cards(1);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    for (let i = 0; i < scienceTags; i++) {
      player.game.defer(new SimpleDeferredAction(
        player,
        () => {
          // No card to discard
          if (player.cardsInHand.length === 0) {
            return undefined;
          }
          return new OrOptions(
            new SelectCard('Select a card to discard', 'Discard', player.cardsInHand, ([card]) => {
              player.cardsInHand.splice(player.cardsInHand.indexOf(card), 1);
              player.game.projectDeck.discard(card);
              player.game.log('${0} is using their ${1} effect to draw a card by discarding a card.', (b) => b.player(player).card(this));
              player.game.log('You discarded ${0}', (b) => b.card(card), {reservedFor: player});
              player.drawCard();
              return undefined;
            }),
            new SelectOption('Do nothing', 'Confirm', () => {
              return undefined;
            }),
          );
        },
      ),
      Priority.DISCARD_AND_DRAW);
    }
    return undefined;
  }
}
