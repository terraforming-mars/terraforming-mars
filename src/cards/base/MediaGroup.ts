import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

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
          b.effectBox((eb) => {
            eb.event().played.startEffect.megacredits(3);
            eb.description('Effect: After you play an event card, you gain 3MC.');
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (card.cardType === CardType.EVENT) {
      player.megaCredits += 3;
    }
  }
  public play() {
    return undefined;
  }
}
