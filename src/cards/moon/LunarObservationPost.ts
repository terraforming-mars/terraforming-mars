import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {IActionCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {VictoryPoints} from '../ICard';

export class LunarObservationPost extends MoonCard implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNAR_OBSERVATION_POST,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE, Tags.SCIENCE],
      cost: 7,

      resourceType: ResourceType.DATA,
      victoryPoints: VictoryPoints.resource(1, 3),
      reserveUnits: Units.of({titanium: 1}),

      metadata: {
        description: 'Spend 1 titanium. 1 VP for every 3 data resources here.',
        cardNumber: 'M22',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 data resource to ANY card', (ab) => {
            ab.data().startAction.asterix();
          });
          b.br;
          b.minus().titanium(1);
        }),
      },
    });
  }

  public override resourceCount: number = 0;

  public override play(player: Player) {
    super.play(player);
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA));
    return undefined;
  }
}
