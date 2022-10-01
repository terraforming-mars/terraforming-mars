import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AICentral extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.AI_CENTRAL,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 21,

      behavior: {
        production: {energy: -1},
      },
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 3)),
      metadata: {
        description: {
          text: 'Requires 3 science tags to play. Decrease your energy production 1 step.',
          align: 'left',
        },
        cardNumber: '208',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw 2 cards.', (ab) => ab.empty().startAction.cards(2)).br;
          b.production((pb) => pb.minus().energy(1));
        }),
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
