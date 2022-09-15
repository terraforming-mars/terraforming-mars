import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {SpaceType} from '../../../common/boards/SpaceType';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MareSerenitatisMine extends Card {
  constructor() {
    super({
      name: CardName.MARE_SERENITATIS_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 21,

      behavior: {
        production: {steel: 1, titanium: 1},
      },
      reserveUnits: {steel: 1, titanium: 2},
      tr: {moonMining: 1, moonLogistics: 1},

      metadata: {
        description: 'Spend 2 titanium and 1 steel. Increase your steel and titanium production 1 step ' +
        'Place a mine ON THE RESERVED AREA and a road tile adjacent to it. Raise the Mining Rate 1 step and the Logistic Rate 1 step.',
        cardNumber: 'M04',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).minus().steel(1).br;
          b.production((pb) => pb.steel(1).titanium(1)).br;
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).asterix().nbsp.moonRoad({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).asterix();
        }),
      },
      tilesBuilt: [TileType.MOON_MINE, TileType.MOON_ROAD],
    });
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_SERENITATIS, this.name);
    MoonExpansion.raiseMiningRate(player);
    const moon = MoonExpansion.moonData(player.game).moon;
    const spaces = moon.getAdjacentSpaces(moon.getSpace(MoonSpaces.MARE_SERENITATIS));
    const availableRoadSpaces = spaces.filter((space) => {
      return space.player === undefined && space.spaceType === SpaceType.LAND;
    });
    player.game.defer(new PlaceMoonRoadTile(player, availableRoadSpaces, 'Select a space next to Mare Serintatis to play a road'));
    return undefined;
  }
}
