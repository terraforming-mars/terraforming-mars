import {IProjectCard} from '../IProjectCard';
import {IResourceCard, VictoryPoints} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class TerraformingRobots extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TERRAFORMING_ROBOTS,
      cost: 7,
      tags: [Tags.SCIENCE],
      resourceType: ResourceType.SPECIALIZED_ROBOT,
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: 'PfTMP',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Mars tag, add 1 specialized robot on this card.', (eb) => {
            eb.mars(1, {played}).startEffect.specializedRobot(1);
          }).br;
          b.vpText('1 VP for every specialized robot on this card.');
        }),
        description: 'Requires 4 science tags.',
      },
    });
  }

  public override resourceCount = 0;

  public onCardPlayed(player: Player, card: IProjectCard) {
    const qty = card.tags.filter((tag) => tag === Tags.MARS).length;
    if (qty !== 0) {
      player.addResourceTo(this, {log: true, qty: qty});
    }
  }

  public play() {
    return undefined;
  }
}
