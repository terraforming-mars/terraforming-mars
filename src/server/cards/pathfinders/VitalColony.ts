import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {BuildColony} from '@/server/deferredActions/BuildColony';

export class VitalColony extends PreludeCard {
  constructor() {
    super({
      name: CardName.VITAL_COLONY,
      tags: [Tag.MARS, Tag.SPACE],

      metadata: {
        cardNumber: 'PfP11',
        renderData: CardRenderer.builder((b) => {
          b.colonies().text('2x bonus');
        }),
        description: 'Place a colony. Receive the placement bonus twice.',
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new BuildColony(player, {giveBonusTwice: true}));
    return undefined;
  }
}

