import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class MartianLizards extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_LIZARDS,
      tags: [Tag.ANIMAL],
      cost: 4,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},
      requirements: {temperature: -2},
      metadata: {
        cardNumber: 'B55',
        description: 'Requires at least -2°C. 1 VP per 2 Animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Heat to add 1 Animal, OR spend 6 Heat to add 2 Animals.', (ab) => {
            ab.heat(1).startAction.resource(CardResource.ANIMAL).br;
            ab.or().br;
            ab.heat(6).startAction.resource(CardResource.ANIMAL, 2);
          }).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.heat >= 1;
  }

  public action(player: IPlayer) {
    if (player.heat < 6) {
      player.stock.deduct(Resource.HEAT, 1);
      player.addResourceTo(this, {qty: 1, log: true});
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Spend 1 Heat to add 1 Animal', 'Spend 1 Heat').andThen(() => {
        player.stock.deduct(Resource.HEAT, 1);
        player.addResourceTo(this, {qty: 1, log: true});
        return undefined;
      }),
      new SelectOption('Spend 6 Heat to add 2 Animals', 'Spend 6 Heat').andThen(() => {
        player.stock.deduct(Resource.HEAT, 6);
        player.addResourceTo(this, {qty: 2, log: true});
        return undefined;
      }),
    );
  }
}
