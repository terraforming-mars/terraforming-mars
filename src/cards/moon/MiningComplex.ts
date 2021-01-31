import {CardName} from '../../CardName';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';

export class MiningComplex extends PreludeCard {
  constructor() {
    super({
      name: CardName.MINING_COMPLEX,
      tags: [Tags.MOON],

      metadata: {
        description: 'Place a mine tile on the Moon and raise the Mining Rate 1 step. ' +
        'Place a road tile adjacent to placed mine tile and raise the Logistics Rate 1 step. ' +
        'Pay 7 MC.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.moonMine().moonRoad().asterix().br.minus().megacredits(7),
        ),
      },
    });
  };

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
    player.setResource(Resources.MEGACREDITS, -7);
    return undefined;
  }
}
