import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';

export class AerospaceMission extends PreludeCard {
  constructor() {
    super({
      name: CardName.AEROSPACE_MISSION,
      tags: [Tag.SPACE],
      behavior: {
        stock: {megacredits: -14},
      },

      metadata: {
        cardNumber: 'Y01',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).nbsp.colonies(1).br;
          b.minus().megacredits(14);
        }),
        description: 'Place 2 colonies. Pay 14 M€.',
      },
    });
  }

  public override bespokeCanPlay(player: Player) {
    return player.canAfford(14);
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new BuildColony(player, {title: 'Select where to build the first colony'}));
    player.game.defer(new BuildColony(player, {title: 'Select where to build the second colony'}));
    return undefined;
  }
}
