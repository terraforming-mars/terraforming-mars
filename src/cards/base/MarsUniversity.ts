import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MarsUniversity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARS_UNIVERSITY,
      tags: [Tags.SCIENCE, Tags.BUILDING],
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
    const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
    for (let i = 0; i < scienceTags; i++) {
      player.game.defer(new DeferredAction(
        player,
        () => {
          // No card to discard
          if (player.cardsInHand.length === 0) {
            return undefined;
          }
          return new OrOptions(
            new SelectCard('Select a card to discard', 'Discard', player.cardsInHand, (foundCards: Array<IProjectCard>) => {
              player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
              player.game.dealer.discard(foundCards[0]);
              player.game.log('${0} is using their ${1} effect to draw a card by discarding a card.', (b) => b.player(player).card(this));
              player.game.log('You discarded ${0}', (b) => b.card(foundCards[0]), {reservedFor: player});
              player.drawCard();
              return undefined;
            }),
            new SelectOption('Do nothing', 'Confirm', () => {
              return undefined;
            }),
          );
        },
      ));
    }
    return undefined;
  }
  public play() {
    return undefined;
  }
}
