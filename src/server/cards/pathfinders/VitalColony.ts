import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {BuildColony} from '../../deferredActions/BuildColony';

export class VitalColony extends PreludeCard {
  constructor() {
    super({
      name: CardName.VITAL_COLONY,
      tags: [Tag.MARS, Tag.SPACE],

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.colonies().text('2x bonus');
        }),
        description: 'Place a colony. Receive the placement bonus twice.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.game.defer(
      new BuildColony(player, {giveBonusTwice: true}));
    return undefined;
  }
}

