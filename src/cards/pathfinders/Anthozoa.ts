import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, VictoryPoints} from '../ICard';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {ResourceType} from '../../common/ResourceType';

export class Anthozoa extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ANTHOZOA,
      cost: 9,
      tags: [Tags.PLANT, Tags.ANIMAL, Tags.MARS],
      requirements: CardRequirements.builder((b) => b.oceans(3)),
      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'Pf55',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to add an animal to this card.', (eb) => {
            eb.plants(1).startAction.animals(1);
          });
        }),
        description: 'Requires 3 oceans on Mars. 1 VP per 2 animals on this card',
      },
    });
  }

  public override resourceCount = 0;

  public canAct(player: Player) {
    return player.plants > 0;
  }

  public action(player: Player) {
    player.addResource(Resources.PLANTS, -1);
    player.addResourceTo(this);
    player.game.log('${0} spent 1 plant to place an animal on ${1}.', (b) => b.player(player).card(this));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

