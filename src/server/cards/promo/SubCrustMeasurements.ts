import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SubCrustMeasurements extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SUB_CRUST_MEASUREMENTS,
      tags: [Tag.SCIENCE, Tag.BUILDING, Tag.EARTH],
      cost: 20,
      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      victoryPoints: 2,

      metadata: {
        cardNumber: 'X29',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw a card.', (eb) => {
            eb.empty().startAction.cards(1);
          });
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    player.drawCard();
    return undefined;
  }
}
