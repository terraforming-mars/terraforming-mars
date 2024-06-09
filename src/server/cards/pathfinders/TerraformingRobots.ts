import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class TerraformingRobots extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TERRAFORMING_ROBOTS,
      cost: 10,
      tags: [Tag.SCIENCE],
      resourceType: CardResource.SPECIALIZED_ROBOT,
      requirements: {tag: Tag.SCIENCE, count: 4},
      victoryPoints: {resourcesHere: {}},

      metadata: {
        cardNumber: 'PfT12',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Mars tag, add 1 specialized robot on this card.', (eb) => {
            eb.tag(Tag.MARS).startEffect.resource(CardResource.SPECIALIZED_ROBOT);
          }).br;
          b.vpText('1 VP for every specialized robot on this card.');
        }),
        description: 'Requires 4 science tags.',
      },
    });
  }


  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    const qty = player.tags.cardTagCount(card, Tag.MARS);
    player.addResourceTo(this, {log: true, qty});
  }
}
