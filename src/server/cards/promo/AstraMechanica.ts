import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {isSpecialTile} from '../../boards/Board';

export class AstraMechanica extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ASTRA_MECHANICA,
      tags: [Tag.SCIENCE],
      cost: 7,

      metadata: {
        cardNumber: 'X51',
        hasExternalHelp: true,
        renderData: CardRenderer.builder((b) => {
          b.cards(2, {secondaryTag: Tag.EVENT}).asterix();
        }),
        description: 'RETURN UP TO 2 OF YOUR PLAYED EVENT CARDS TO YOUR HAND. THEY MAY NOT BE CARDS THAT PLACE SPECIAL TILES.',
      },
    });
  }

  private static UNUSABLE_CARDS = [
    CardName.PATENT_MANIPULATION,
    CardName.RETURN_TO_ABANDONED_TECHNOLOGY,
    CardName.HOSTILE_TAKEOVER,
  ];

  private getCards(player: IPlayer): ReadonlyArray<IProjectCard> {
    return player.playedCards.filter((card) => {
      if (card.type !== CardType.EVENT) {
        return false;
      }
      if (AstraMechanica.UNUSABLE_CARDS.includes(card.name)) {
        return false;
      }
      if (card.tilesBuilt.some(isSpecialTile)) {
        return false;
      }
      return true;
    });
  }

  private hasUnusableCards(player: IPlayer): boolean {
    return AstraMechanica.UNUSABLE_CARDS.some((cardName) => player.playedCards.get(cardName) !== undefined);
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (this.hasUnusableCards(player)) {
      this.warnings.add('unusableEventsForAstraMechanica');
    }
    return this.getCards(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const events = this.getCards(player);
    if (events.length === 0) {
      player.game.log('${0} had no events', (b) => b.player(player));
      return undefined;
    }
    return new SelectCard(
      'Select up to 2 events to return to your hand',
      'Select',
      events,
      {max: 2, min: 0})
      .andThen(
        (cards) => {
          for (const card of cards) {
            player.playedCards.remove(card);
            player.cardsInHand.push(card);
            card.onDiscard?.(player);
            player.game.log('${0} returned ${1} to their hand', (b) => b.player(player).card(card));
          }
          return undefined;
        });
  }
}
