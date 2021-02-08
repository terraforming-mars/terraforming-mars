import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Units} from '../../Units';
import {SpaceType} from '../../SpaceType';
import {IProjectCard} from '../IProjectCard';
import {IMoonCard} from './IMoonCard';
import {TileType} from '../../TileType';
import {MoonCard} from './MoonCard';

export class MareSerenitatisMine extends MoonCard implements IProjectCard, IMoonCard {
  constructor() {
    super({
      name: CardName.MARE_SERENITATIS_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 21,
      productionBox: Units.of({steel: 1, titanium: 1}),

      metadata: {
        description: 'Spend 2 titanium and 1 steel. Increase your steel production 1 step and your titanium production 1 step. ' +
        'Place a mine ON THE RESERVED AREA and a road tile adjacent to it. Raise the Mining Rate 1 step and the Logistic Rate 1 step.',
        cardNumber: 'M04',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).minus().steel(1).br;
          b.production((pb) => pb.steel(1).titanium(1)).br;
          b.moonMine().asterix().nbsp.moonRoad().asterix();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2, steel: 1}),
      tilesBuilt: [TileType.MOON_MINE, TileType.MOON_ROAD],
    });
  }

  public canPlay(player: Player) {
    return super.canPlay(player);
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_SERENITATIS, this.name);
    MoonExpansion.raiseMiningRate(player);
    const moon = MoonExpansion.moonData(player.game).moon;
    const spaces = moon.getAdjacentSpaces(moon.getSpace(MoonSpaces.MARE_SERENITATIS));
    const availableRoadSpaces = spaces.filter((space) => {
      return space.player === undefined && space.spaceType === SpaceType.LAND;
    });
    player.game.defer(new PlaceMoonRoadTile(player, 'Select a space next to Mare Serintatis to play a road', availableRoadSpaces));
    return undefined;
  }
}
