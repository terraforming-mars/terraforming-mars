import {CardName} from '../../common/cards/CardName';
import {Tags} from '../../common/cards/Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {SpaceType} from '../../common/boards/SpaceType';
import {Resources} from '../../common/Resources';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';
import {TileType} from '../../common/TileType';

export class MiningComplex extends PreludeCard {
  constructor() {
    super({
      name: CardName.MINING_COMPLEX,
      tags: [Tags.MOON],
      startingMegacredits: -7,

      metadata: {
        description: 'Place a mine tile on the Moon and raise the Mining Rate 1 step. ' +
        'Place a road tile adjacent to placed mine tile and raise the Logistics Rate 1 step. ' +
        'Pay 7 M€.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE}).asterix().br.minus().megacredits(7),
        ),
      },
    });
  }

  public tilesBuilt = [TileType.MOON_MINE, TileType.MOON_ROAD];

  public play(player: Player) {
    player.game.defer(new PlaceMoonMineTile(player)
      .andThen((space) => {
        const moon = MoonExpansion.moonData(player.game).moon;
        const spaces = moon.getAdjacentSpaces(space);
        const availableRoadSpaces = spaces.filter((space) => {
          return space.player === undefined && space.spaceType === SpaceType.LAND;
        });
        player.game.defer(
          new PlaceMoonRoadTile(
            player,
            'Select a space next to the mine for a road',
            availableRoadSpaces));
      }));
    player.deductResource(Resources.MEGACREDITS, 7);
    return undefined;
  }
}
