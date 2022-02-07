import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class OptimalAerobraking extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OPTIMAL_AEROBRAKING,
      tags: [Tags.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '031',
        renderData: CardRenderer.builder((b) => b.effect('When you play a Space Event, you gain 3 M€ and 3 heat.', (be) => {
          be.space({played}).event({played}).startEffect.megacredits(3).heat(3);
        })),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cardType === CardType.EVENT && card.tags.includes(Tags.SPACE)) {
      player.megaCredits += 3;
      player.heat += 3;
    }
  }
  public play() {
    return undefined;
  }
}
