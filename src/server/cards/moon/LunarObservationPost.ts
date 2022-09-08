import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {IActionCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class LunarObservationPost extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNAR_OBSERVATION_POST,
      cardType: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.SCIENCE],
      cost: 7,

      resourceType: CardResource.DATA,
      victoryPoints: VictoryPoints.resource(1, 3),
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. 1 VP for every 3 data resources here.',
        cardNumber: 'M22',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 data resource to ANY card', (ab) => {
            ab.empty().startAction.data().asterix();
          });
          b.br;
          b.minus().titanium(1);
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA));
    return undefined;
  }
}
