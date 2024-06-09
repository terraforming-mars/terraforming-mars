import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IProjectCard, isIProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';

export class CloudVortexOutpost extends PreludeCard {
  constructor() {
    super({
      name: CardName.CLOUD_VORTEX_OUTPOST,
      tags: [Tag.VENUS],

      behavior: {
        global: {venus: 2},
      },

      metadata: {
        cardNumber: 'UP15',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br;
          b.plainText('Raise Venus 2 steps').br;
          b.effect('After you play your FIRST project card that can hold floaters, put 3 floaters on it.',
            (eb) => eb.cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).asterix().startEffect.resource(CardResource.FLOATER, 3));
        }),
      },
    });
  }

  public data: {isDisabled: boolean} = {isDisabled: false};

  onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (this.data.isDisabled) {
      return;
    }
    if (card.resourceType === CardResource.FLOATER && isIProjectCard(card)) {
      player.addResourceTo(card, {qty: 3, log: true});
      this.data.isDisabled = true;
    }
  }
}
