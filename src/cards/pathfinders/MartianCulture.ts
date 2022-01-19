import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, VictoryPoints} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {all} from '../Options';

export class MartianCulture extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_CULTURE,
      cost: 11,
      tags: [Tags.MARS, Tags.MARS],
      resourceType: ResourceType.DATA,
      requirements: CardRequirements.builder((b) => b.tag(Tags.MARS, 2, {all})),
      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'Pf35',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Data resource to any card.', (eb) => eb.empty().startAction.data({amount: 1}));
        }),
        description: 'Requires any 2 Mars tags in play.  1 VP for every 2 data here.',
      },
    });
  }

  public override resourceCount = 0;

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

