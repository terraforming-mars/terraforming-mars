import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {IActionCard} from './../ICard';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SubCrustMeasurements extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SUB_CRUST_MEASUREMENTS,
      tags: [Tags.SCIENCE, Tags.BUILDING, Tags.EARTH],
      cost: 20,

      metadata: {
        cardNumber: 'X28',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
        renderData: CardRenderer.builder((b) => {
          b.action('Draw a card.', (eb) => {
            eb.empty().startAction.cards(1);
          });
        }),
        description: 'Requires 2 science tags.',
        victoryPoints: 2,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public getVictoryPoints() {
    return 2;
  }

  public action(player: Player) {
    player.drawCard();
    return undefined;
  }
}
