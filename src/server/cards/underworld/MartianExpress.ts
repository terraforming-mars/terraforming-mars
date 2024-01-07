import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class MartianExpress extends Card implements IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_EXPRESS,
      cost: 5,
      tags: [Tag.MARS],
      victoryPoints: 1,
      requirements: {cities: 1, all: true},
      resourceType: CardResource.WARE,

      metadata: {
        cardNumber: 'U78',
        renderData: CardRenderer.builder((b) => {
          b.action('This card can receive any resource that can be placed on a card. Resources placed here get converted to Wares resources.',
            (ab) => ab.wild(1).asterix().startEffect.ware(1)).br;
          b.action('Remove all wares from here and gain 1 M€ for each ware removed.',
            (ab) => ab.text('x').ware(1).startAction.text('x').megacredits(1));
        }),
        description: 'Requires 1 city in play.',
      },
    });
  }

  canAct(): boolean {
    return this.resourceCount > 0;
  }

  action(player: IPlayer): undefined {
    const count = this.resourceCount;
    player.stock.add(Resource.MEGACREDITS, count);
    this.resourceCount = 0;
    player.game.log('${0} used the ${1} action to convert ${2} wares into ${2} M€',
      (b) => b.player(player).card(this).number(count));
    return undefined;
  }
}
