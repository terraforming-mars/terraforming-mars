import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {intersection} from '../../../common/utils/utils';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';

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
      this.warnings.add('maxoceans');
    }
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceOceanTile(player, {
      spaces: this.availableSpaces(player),
    })).andThen((space) => {
      UnderworldExpansion.excavate(player, space);
    });
    return undefined;
  }
}

