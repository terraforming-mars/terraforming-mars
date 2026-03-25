import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {intersection} from '../../../common/utils/utils';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {ClaimSpacesDeferred} from '../../underworld/ClaimSpacesDeferred';

export class CentralReservoir extends PreludeCard {
  constructor() {
    super({
      name: CardName.CENTRAL_RESERVOIR,
      tags: [Tag.BUILDING],

      metadata: {
        cardNumber: 'UP09',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).asterix().geoscan().asterix().br.claim(2);
        }),
        description: 'Place an ocean ON AN AREA NOT RESERVED FOR OCEAN. ' +
          'Then identify the underground resources in all adjacent spaces. Claim 2 of them.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    const excavatableSpaces = UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true});
    const oceanSpaces = player.game.board.getAvailableSpacesOnLand(player);
    return oceanSpaces.filter((space) => {
      return intersection(player.game.board.getAdjacentSpaces(space), excavatableSpaces).length > 0;
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceOceanTile(player, {
      spaces: this.availableSpaces(player),
    })).andThen((space) => {
      if (!space) {
        return;
      }
      const spaces = UnderworldExpansion.identifyAdjacentSpaces(player, space);
      player.game.defer(new ClaimSpacesDeferred(player, 2, spaces));
    });
    return undefined;
  }
}

