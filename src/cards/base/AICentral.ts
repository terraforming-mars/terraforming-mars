import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class AICentral extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.AI_CENTRAL,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 21,
      productionBox: Units.of({energy: -1}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      metadata: {
        description: {
          text: 'Requires 3 Science tags to play. Decrease your Energy production 1 step.',
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
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
