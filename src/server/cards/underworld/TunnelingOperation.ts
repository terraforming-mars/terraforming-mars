import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {IdentifySpacesDeferred} from '../../underworld/IdentifySpacesDeferred';
import {ExcavateSpacesDeferred} from '../../underworld/ExcavateSpacesDeferred';
import {digit} from '../Options';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class TunnelingOperation extends PreludeCard {
  constructor() {
    super({
      name: CardName.TUNNELING_OPERATION,
      tags: [Tag.BUILDING],

      behavior: {
        production: {steel: 2},
      },

      metadata: {
        cardNumber: 'UP05',
        renderData: CardRenderer.builder((b) => {
          b.identify(1).excavate(2, {digit}).production((pb) => pb.steel(2, {digit}));
        }),
        description: 'Identify 1 underground resource. Then excavate 2 underground resources. Increase your steel production 2 steps.',
      },
    });
  }

  public override canPlay(player: IPlayer): boolean {
    return UnderworldExpansion.canIdentifyN(player, 1) && UnderworldExpansion.canExcavateN(player, 2);
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new IdentifySpacesDeferred(player, 1)).andThen(() => {
      player.game.defer(new ExcavateSpacesDeferred(player, 2));
    });
    return undefined;
  }
}
