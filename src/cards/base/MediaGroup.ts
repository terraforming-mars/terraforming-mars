import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MediaGroup extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MEDIA_GROUP,
      tags: [Tags.EARTH],
      cost: 6,

      metadata: {
        cardNumber: '109',
        renderData: CardRenderer.builder((b) => {
          b.effect('After you play an event card, you gain 3 M€.', (eb) => {
            eb.event({played}).startEffect.megacredits(3);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cardType === CardType.EVENT) {
      player.megaCredits += 3;
    }
  }
  public play() {
    return undefined;
  }
}
