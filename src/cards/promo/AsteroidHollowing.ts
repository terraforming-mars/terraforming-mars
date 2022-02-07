import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidHollowing extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ASTEROID_HOLLOWING,
      tags: [Tags.SPACE],
      cost: 16,
      resourceType: ResourceType.ASTEROID,

      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'X15',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 asteroid resource here and increase M€ production 1 step.', (eb) => {
            eb.titanium(1).startAction.asteroids(1).production((pb) => pb.megacredits(1));
          }).br;
          b.vpText('1VP for each 2 asteroids on this card.');
        }),
      },
    });
  }
  public override resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.titanium > 0;
  }

  public action(player: Player) {
    player.deductResource(Resources.TITANIUM, 1);
    player.addProduction(Resources.MEGACREDITS, 1);
    player.addResourceTo(this, {log: true});

    return undefined;
  }
}
