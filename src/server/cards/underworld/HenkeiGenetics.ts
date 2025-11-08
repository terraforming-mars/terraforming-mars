import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IActionCard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {digit} from '../Options';

export class HenkeiGenetics extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.HENKEI_GENETICS,
      tags: [Tag.MICROBE],
      startingMegaCredits: 47,
      resourceType: CardResource.MICROBE,

      victoryPoints: {resourcesHere: {}, per: 3},

      behavior: {
        underworld: {corruption: 1},
      },

      action: {
        spend: {corruption: 1},
      },

      firstAction: {
        text: 'Draw 2 microbe cards',
        drawCard: {count: 2, tag: Tag.MICROBE},
      },

      metadata: {
        cardNumber: 'UC04',
        description: 'You start with 47 M€ and 1 corruption. As your first action, draw 2 microbe cards. ' +
          '1 VP per 3 microbes on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(47).corruption(1).cards(2, {secondaryTag: Tag.MICROBE}).br;
          b.action('Pay 1 corruption to place 3 microbes on each card, up 2 to cards.', (ab) => {
            ab.corruption(1).startAction
              .resource(CardResource.MICROBE, {amount: 3, digit}).asterix()
              .resource(CardResource.MICROBE, {amount: 3, digit}).asterix();
          });
        }),
      },
    });
  }

  private availableCards(player: IPlayer) {
    return player.getResourceCards(CardResource.MICROBE);
  }

  public canAct(player: IPlayer) {
    if (this.availableCards(player).length === 0) {
      this.warnings.add('noMatchingCards');
    }
    return player.underworldData.corruption > 0;
  }

  public action(player: IPlayer) {
    UnderworldExpansion.loseCorruption(player, 1);
    const availableCards = this.availableCards(player);
    if (availableCards.length === 0) {
      return undefined;
    }
    return new SelectCard(
      'Select up to 2 cards to gain 3 microbes each',
      undefined,
      availableCards,
      {min: 0, max: 2})
      .andThen((cards) => {
        if (cards.length === 0) {
          player.game.log('${0} selected no cards.', (b) => b.player(player));
        }
        for (const card of cards) {
          player.addResourceTo(card, {qty: 3, log: true});
        }
        return undefined;
      });
  }
}
