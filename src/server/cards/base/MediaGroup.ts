import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {GainResources} from '../../deferredActions/GainResources';
import {Resources} from '../../../common/Resources';

export class MediaGroup extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MEDIA_GROUP,
      tags: [Tag.EARTH],
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
      player.game.defer(new GainResources(player, Resources.MEGACREDITS, {count: 3}));
    }
  }
}
