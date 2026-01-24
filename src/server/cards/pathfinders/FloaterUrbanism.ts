import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {SelectCard} from '../../inputs/SelectCard';

export class FloaterUrbanism extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FLOATER_URBANISM,
      cost: 7,
      tags: [Tag.VENUS],
      resourceType: CardResource.VENUSIAN_HABITAT,
      requirements: {tag: Tag.VENUS, count: 4},
      victoryPoints: {resourcesHere: {}},

      metadata: {
        cardNumber: 'Pf59',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 floater from any card to add 1 Venusian habitat on this card.', (ab) => {
            ab.minus().resource(CardResource.FLOATER).startAction.resource(CardResource.VENUSIAN_HABITAT);
          }).br;
          b.vpText('1 VP for every Venusian habitat on this card.');
        }),
        description: 'Requires 4 Venus tags.',
      },
    });
  }


  public canAct(player: IPlayer) {
    return player.getResourceCount(CardResource.FLOATER) > 0;
  }

  public action(player: IPlayer) {
    const cards = player.getCardsWithResources(CardResource.FLOATER);
    const input = new SelectCard(
      'Choose a card to move a floater to a Venusian habitat.',
      'Choose',
      cards)
      .andThen(([card]) => {
        player.removeResourceFrom(card, 1);
        player.addResourceTo(this, {log: true});
        return undefined;
      });
    if (cards.length === 0) {
      return undefined;
    }
    if (cards.length === 1) {
      input.cb(cards);
      return undefined;
    }
    return input;
  }
}
