import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {all} from '../Options';
import {ExcavateSpaceDeferred} from '../../underworld/ExcavateSpaceDeferred';

export class EarthquakeMachine extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EARTHQUAKE_MACHINE,
      tags: [Tag.SCIENCE],
      cost: 15,
      requirements: {tag: Tag.SCIENCE, count: 2},

      behavior: {
        decreaseAnyProduction: {type: Resource.PLANTS, count: 1},
      },

      metadata: {
        cardNumber: 'U55',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to excavate an underground resource on any space on Mars that has no tile on it.',
            (ab) => ab.energy(1).startAction.excavate(1).asterix());
          b.br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.plainText('Requires 2 science tags. Decrease any plant production 1 step');
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.energy > 0 && UnderworldExpansion.excavatableSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    player.stock.deduct(Resource.ENERGY, 1);
    const spaces = UnderworldExpansion.excavatableSpaces(player, false).filter((space) => space.tile !== undefined);
    player.game.defer(new ExcavateSpaceDeferred(player, spaces));
    return undefined;
  }
}
