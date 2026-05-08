import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class BiomassReactor extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIOMASS_REACTOR,
      tags: [Tag.POWER, Tag.SCIENCE],
      cost: 28,
      requirements: {tag: Tag.PLANT, count: 2},
      behavior: {
        production: {energy: 4},
      },
      metadata: {
        cardNumber: 'B15',
        description: 'Requires you own 2 Plant tags. Increase your Energy production 4 steps.',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Plant production 1 step to increase your Energy production 1 step.', (ab) => {
            ab.production((pb) => pb.minus().plants(1)).startAction.production((pb) => pb.energy(1));
          }).br;
          b.production((pb) => pb.energy(4));
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.production.plants >= 1;
  }

  public action(player: IPlayer) {
    player.production.add(Resource.PLANTS, -1, {log: true});
    player.production.add(Resource.ENERGY, 1, {log: true});
    return undefined;
  }
}
