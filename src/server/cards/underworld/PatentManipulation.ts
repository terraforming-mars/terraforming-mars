import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {isSpecialTile} from '../../boards/Board';

export class PatentManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PATENT_MANIPULATION,
      cost: 7,

      requirements: {corruption: 1},
      victoryPoints: -2,

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).asterix(); // TODO(kberg): add altsecondarytag.green, and show both blue and green tags.
        }),
        description: 'RETURN 1 OF YOUR PLAYED GREEN OR BLUE CARDS TO YOUR HAND. IT MAY NOT BE A CARD THAT PLACES SPECIAL TILES OR RETURNS PLAYED CARDS TO YOUR HAND.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.getCards(player).length > 0;
  }

  private getCards(player: IPlayer): ReadonlyArray<IProjectCard> {
    return player.playedCards.filter((card) => {
      if (card.type !== CardType.AUTOMATED && card.type !== CardType.ACTIVE) {
        return false;
      }
      if (card.name === CardName.ASTRA_MECHANICA) {
        return false;
      }
      if (card.tilesBuilt.some(isSpecialTile)) {
        return false;
      }
      return true;
    });
  }

  // TODO(kberg): much of this card is a duplicate of Astra Mechanica.
  public override bespokePlay(player: IPlayer) {
    const candidates = this.getCards(player);
    if (candidates.length === 0) {
      player.game.log('${0} had no collectable green or blue project cards', (b) => b.player(player));
      return undefined;
    }
    return new SelectCard(
      'Select 1 card to return to your hand',
      'Select',
      candidates)
      .andThen(
        (cards) => {
          for (const card of cards) {
            player.playedCards = player.playedCards.filter((c) => c.name !== card.name);
            player.cardsInHand.push(card);
            card.onDiscard?.(player);
            player.game.log('${0} returned ${1} to their hand', (b) => b.player(player).card(card));
          }
          return undefined;
        });
  }
}
