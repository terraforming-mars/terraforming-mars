import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {digit} from '../Options';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {PlayerInput} from '../../PlayerInput';
import {SelectCard} from '../../inputs/SelectCard';

export class CeresTechMarket extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.CERES_TECH_MARKET,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 12,
      victoryPoints: 1,

      behavior: {
        stock: {
          megacredits: {
            colonies: {colonies: {}},
            each: 2,
          },
        },
      },

      metadata: {
        cardNumber: 'P68',
        renderData: CardRenderer.builder((b) => {
          b.action('Discard any number of cards from your hand to gain 2 M€ for each discarded card.', (ab) =>
            ab.text('-X').cards(1).startAction.text('2x').megacredits(1, {digit})).br;
          b.megacredits(2).slash().colonies().br;
          b.plainText('(Gain 2 M€ per colony you own.)').br;
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.cardsInHand.length > 0;
  }

  // Pretty much a duplicate of SellPatents. Also similar to Ender.
  // Should make card discarding a behavior.
  public action(player: IPlayer): PlayerInput | undefined {
    return new SelectCard(
      'Discard cards for 2 M€ each',
      'Discard',
      player.cardsInHand,
      {max: player.cardsInHand.length, played: false})
      .andThen((cards) => {
        cards.forEach((card) => player.discardCardFromHand(card));
        const megacredits = cards.length * 2;
        player.megaCredits += megacredits;
        player.game.log('${0} gained ${1} M€ by discarding ${2} cards', (b) => b.player(player).number(megacredits).number(cards.length));
        return undefined;
      });
  }
}
