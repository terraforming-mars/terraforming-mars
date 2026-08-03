import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {TileType} from '../../../common/TileType';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Space} from '../../boards/Space';
import {MoonBoard} from '../../moon/MoonBoard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class MiningComplex extends PreludeCard {
  constructor() {
    super({
      name: CardName.MINING_COMPLEX,
      tags: [Tag.MOON],
      startingMegacredits: -7,
      tr: {
        moonMining: 1,
        moonLogistic: 1,
      },
      tilesBuilt: [TileType.MOON_MINE, TileType.MOON_ROAD],

      metadata: {
        description: 'Place a mine tile on The Moon and raise the mining rate 1 step. ' +
        'Place a road tile adjacent to placed mine tile and raise the logistic rate 1 step. ' +
        'Pay 7 M€.',
        cardNumber: 'MP5',
        renderData: CardRenderer.builder((b) =>
          b.moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTIC_RATE}).asterix().br.minus().megacredits(7),
        ),
      },
    });
  }

  // Land spaces next to |space| where a road tile could be placed.
  private adjacentRoadSpaces(moon: MoonBoard, space: Space): Array<Space> {
    return moon.getAdjacentSpaces(space).filter((s) => s.player === undefined && s.spaceType === SpaceType.LAND);
  }

  // A mine may only be placed where an adjacent road can also be placed.
  private availableMineSpaces(player: IPlayer): Array<Space> {
    const moon = MoonExpansion.moonData(player.game).moon;
    return moon.getAvailableSpacesForMine(player).filter((space) => this.adjacentRoadSpaces(moon, space).length > 0);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.canAfford(7) && this.availableMineSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const moon = MoonExpansion.moonData(player.game).moon;
    player.game.defer(new PlaceMoonMineTile(player, this.availableMineSpaces(player)))
      .andThen((space) => {
        player.game.defer(
          new PlaceMoonRoadTile(
            player,
            this.adjacentRoadSpaces(moon, space),
            'Select a space next to the mine for a road',
          ))
          .andThen(() => {
            player.game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits))
              .andThen(() => {
                PathfindersExpansion.addToSolBank(player);
              });
          });
      });
    return undefined;
  }
}
