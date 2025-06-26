import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Resource} from '../../../common/Resource';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {TileType} from '../../../common/TileType';

export class MiningComplex extends PreludeCard {
  constructor() {
    super({
      name: CardName.MINING_COMPLEX,
      tags: [Tag.MOON],
      startingMegacredits: -7,
      tr: {
        moonMining: 1,
        moonLogistics: 1,
      },
      tilesBuilt: [TileType.MOON_MINE, TileType.MOON_ROAD],

      metadata: {
        description: 'Place a mine tile on The Moon and raise the mining rate 1 step. ' +
        'Place a road tile adjacent to placed mine tile and raise the Logistics Rate 1 step. ' +
        'Pay 7 M€.',
        cardNumber: 'MP5',
        renderData: CardRenderer.builder((b) =>
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE}).asterix().br.minus().megacredits(7),
        ),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.canAfford(7);
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceMoonMineTile(player))
      .andThen((space) => {
        const moon = MoonExpansion.moonData(player.game).moon;
        const spaces = moon.getAdjacentSpaces(space);
        const availableRoadSpaces = spaces.filter((space) => {
          return space.player === undefined && space.spaceType === SpaceType.LAND;
        });
        player.game.defer(
          new PlaceMoonRoadTile(
            player,
            availableRoadSpaces,
            'Select a space next to the mine for a road',
          ));
      });
    player.stock.deduct(Resource.MEGACREDITS, 7);
    return undefined;
  }
}
