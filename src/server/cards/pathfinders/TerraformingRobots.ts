import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class TerraformingRobots extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TERRAFORMING_ROBOTS,
      cost: 7,
      tags: [Tag.SCIENCE],
      resourceType: CardResource.SPECIALIZED_ROBOT,
      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 4)),
      victoryPoints: {resourcesHere: {}, each: 1, per: 1},

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


  public onCardPlayed(player: Player, card: IProjectCard) {
    const qty = player.tags.cardTagCount(card, Tag.MARS);
    player.addResourceTo(this, {log: true, qty});
  }
}
