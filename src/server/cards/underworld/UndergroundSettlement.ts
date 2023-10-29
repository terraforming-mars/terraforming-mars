import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {intersection} from '../../../common/utils/utils';

export class UndergroundSettlement extends PreludeCard {
  constructor() {
    super({
      name: CardName.UNDERGROUND_SETTLEMENT,
      tags: [Tag.CITY, Tag.BUILDING],

      metadata: {
        cardNumber: 'UP07',
        renderData: CardRenderer.builder((b) => {
          b.city().excavate().asterix();
        }),
        description: 'Place a city tile. Then excavate the underground resource in its space.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return intersection(
      player.game.board.getAvailableSpacesForCity(player),
      UnderworldExpansion.excavatableSpaces(player));
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select space for city tile', this.availableSpaces(player))
      .andThen((space) => {
        player.game.addCity(player, space);
        UnderworldExpansion.excavate(player, space);
        return undefined;
      });
  }
}

