import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Units} from '../../../common/Units';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class AgroDrones extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.AGRO_DRONES,
      cost: 14,
      tags: [Tag.PLANT, Tag.MARS],

      requirements: {temperature: -18},
      metadata: {
        cardNumber: 'Pf04',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel and 1 energy to gain 3 plants.', (eb) => {
            eb.steel(1).energy(1).startAction.plants(3);
          });
        }),
        description: 'Requires -18° C or warmer.',
      },
    });
  }

  public canAct(player: IPlayer) {
    return player.steel > 0 && player.energy > 0;
  }

  public action(player: IPlayer) {
    // TODO(kberg): add method Stock.adjust?
    player.stock.deductUnits(Units.of({steel: 1, energy: 1}));
    player.stock.add(Resource.PLANTS, 3);
    player.game.log('${0} spent 1 steel and 1 energy to gain 3 plants.', (b) => b.player(player));
    PathfindersExpansion.addToSolBank(player);
    return undefined;
  }
}

