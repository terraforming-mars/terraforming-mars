import {PreludeCard} from '../prelude/PreludeCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

export class EarlyColonization extends PreludeCard {
  constructor() {
    super({
      tags: [Tag.SPACE],
      name: CardName.EARLY_COLONIZATION,

      behavior: {
        colonies: {buildColony: {}},
        stock: {energy: 3},
      },

      metadata: {
        cardNumber: 'P48',
        description: 'Place a colony. Gain 3 energy.',
        renderData: CardRenderer.builder((b) => {
          b.colonyTile({all}).text('+2').br;
          b.text('INCREASE ALL COLONY TRACKS 2 STEPS', Size.SMALL, true).br;
          b.colonies(1).energy(3);
        }),
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    player.game.colonies.forEach((colony) => {
      if (colony.isActive) {
        colony.increaseTrack(2);
      }
    });
    return undefined;
  }
}
