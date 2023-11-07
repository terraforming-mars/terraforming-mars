import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {intersection} from '../../../common/utils/utils';

export class CentralReservoir extends PreludeCard {
  constructor() {
    super({
      name: CardName.CENTRAL_RESERVOIR,
      tags: [Tag.BUILDING],

      behavior: {tr: 1},

      metadata: {
        cardNumber: 'UP09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).oceans(1).asterix().excavate().asterix();
        }),
        description: 'Gain 1 TR. Place an ocean tile ON AN AREA NOT RESERVED FOR OCEAN. ' +
          'Then excavate the underground resource in that space.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return intersection(
      player.game.board.getAvailableSpacesOnLand(player),
      UnderworldExpansion.excavatableSpaces(player));
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (!player.game.canAddOcean()) {
      return false;
    }
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select space for ocean tile', this.availableSpaces(player))
      .andThen((space) => {
        player.game.addOcean(player, space);
        UnderworldExpansion.excavate(player, space);
        return undefined;
      });
  }
}

