import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';

export class Cryptocurrency extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.CRYPTOCURRENCY,
      cost: 6,
      tags: [Tag.POWER],
      resourceType: CardResource.DATA,

      metadata: {
        cardNumber: 'Pf51',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to add 1 data to this card.', (eb) => {
            eb.energy(1).startAction.data({amount: 1}).or();
          }).br;
          b.action('Remove all data from this card to gain 3M€ per data removed.', (eb) => {
            eb.text('x').data({amount: 1}).startAction.text('x').megacredits(3);
          });
        }),
      },
    });
  }


  public canAct(player: IPlayer) {
    return player.energy > 0 || this.resourceCount > 0;
  }

  public action(player: IPlayer) {
    const firstOption = new SelectOption(
      'Spend 1 energy to add 1 data to this card.',
      'Spend energy')
      .andThen(() => {
        player.stock.deduct(Resource.ENERGY, 1);
        player.addResourceTo(this, {qty: 1, log: true});
        return undefined;
      });

    const secondOption = new SelectOption(
      'Remove all data from this card to gain 3M€ per data removed.',
      'Spend data')
      .andThen(() => {
        player.stock.add(Resource.MEGACREDITS, 3 * this.resourceCount, {log: true});
        this.resourceCount = 0; // Should this use addResourceTo?
        return undefined;
      });

    if (this.resourceCount === 0) {
      firstOption.cb(undefined);
      return undefined;
    }
    if (player.energy === 0) {
      secondOption.cb(undefined);
      return undefined;
    }
    return new OrOptions(firstOption, secondOption);
  }
}
