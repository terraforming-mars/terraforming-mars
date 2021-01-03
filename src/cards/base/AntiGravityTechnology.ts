import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class AntiGravityTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ANTI_GRAVITY_TECHNOLOGY,
      tags: [Tags.SCIENCE],
      cost: 14,

      metadata: {
        description: 'Requires 7 science tags.',
        cardNumber: '150',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 7)),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((be) => be.empty().startEffect.megacredits(-2).description('Effect: When you play a card, you pay 2 MC less for it.'));
        }),
        victoryPoints: 3,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 7;
  }
  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 3;
  }
}
