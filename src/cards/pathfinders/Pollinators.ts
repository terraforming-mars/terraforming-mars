import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard, VictoryPoints} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {Resources} from '../../common/Resources';

export class Pollinators extends Card implements IProjectCard, IResourceCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.POLLINATORS,
      cost: 19,
      tags: [Tags.PLANT, Tags.ANIMAL],
      resourceType: ResourceType.ANIMAL,
      requirements: CardRequirements.builder((b) => b.tag(Tags.PLANT, 3)),
      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: '...',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal on this card', (ab) => ab.empty().startAction.animals(1)).br;
          b.production((pb) => pb.plants(1).megacredits(2));
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 3 plant tags. Raise your plant production 1 step and your M€ production 2 steps.',
      },
    });
  }

  public override resourceCount = 0;

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
