import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {ClaimSpaceDeferred} from '../../underworld/ClaimSpaceDeferred';
import {intersection} from '../../../common/utils/utils';

export class UndergroundSettlement extends PreludeCard {
  constructor() {
    super({
      name: CardName.UNDERGROUND_SETTLEMENT,
      tags: [Tag.CITY, Tag.BUILDING],

      metadata: {
        cardNumber: 'UP07',
        renderData: CardRenderer.builder((b) => {
          b.city().geoscan().asterix().br.claim(1);
        }),
        description: 'Place a city. Then identify the underground resources in all adjacent spaces. Claim 1 of them.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    const excavatableSpaces = UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true});
    const citySpaces = player.game.board.getAvailableSpacesForCity(player);
    return citySpaces.filter((space) => {
      return intersection(player.game.board.getAdjacentSpaces(space), excavatableSpaces).length > 0;
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {
      spaces: this.availableSpaces(player),
    })).andThen((space) => {
      if (space === undefined) {
        return;
      }
      const claimableSpaces = UnderworldExpansion.identifyAdjacentSpaces(player, space);
      player.game.defer(new ClaimSpaceDeferred(player, claimableSpaces));
      return;
    });
    return undefined;
  }
}
