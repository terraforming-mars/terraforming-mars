import {LogHelper} from '../LogHelper';
import {Game} from '../Game';
import {ITile} from '../ITile';
import {MoonBoard} from './MoonBoard';
import {Player} from '../Player';
import {TileType} from '../TileType';
// import {MoonSerialization} from './MoonSerialization';
// import {MoonModel} from './MoonModel';
// import {SpaceType} from '../SpaceType';
// import {Resources} from '../Resources';
import {IMoonData} from './IMoonData';
import {CardName} from '../CardName';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../Units';
import {IMoonCard} from '../cards/moon/IMoonCard';
import {Tags} from '../cards/Tags';
// import {IProjectCard} from '../cards/IProjectCard';
// import {Units} from '../Units';
// import {CardName} from '../CardName';
// import {IMoonCard} from './IMoonCard';

// export interface CoOwnedSpace {
//   spaceId: string;
//   coOwner: PlayerId;
// }

const MOON_TILES = [
  TileType.MOON_MINE,
  TileType.MOON_COLONY,
  TileType.MOON_ROAD,
  TileType.LUNA_TRADE_STATION,
  TileType.LUNA_MINING_HUB,
  TileType.LUNA_TRAIN_STATION,
  TileType.LUNAR_MINE_URBANIZATION,
];

export class MoonExpansion {
  private constructor() {
  }

  // If the moon expansion is enabled, execute this callback, otherwise do nothing.
  public static ifMoon(game: Game, cb: (moonData: IMoonData) => void) {
    if (game.gameOptions.moonExpansion) {
      if (game.moonData === undefined) {
        console.log(`Assertion failure: game.moonData is undefined for ${game.id}`);
        return;
      }
      cb(game.moonData);
    }
  }

  // If the moon expansion is enabled, return with the game's MoonData instance, otherwise throw an error.
  public static moonData(game: Game): IMoonData {
    if (game.gameOptions.moonExpansion === true && game.moonData !== undefined) {
      return game.moonData;
    }
    throw new Error('Assertion error: Using a Moon feature when the Moon expansion is undefined.');
  }

  public static initialize(): IMoonData {
    return {
      moon: MoonBoard.newInstance(),
      colonyRate: 0,
      miningRate: 0,
      logisticRate: 0,
      lunaFirstPlayer: undefined,
    };
  }

  public static addMineTile(
    player: Player, spaceId: string, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_MINE, card: cardName});
  }

  public static addColonyTile(
    player: Player, spaceId: string, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_COLONY, card: cardName});
  }

  public static addRoadTile(
    player: Player, spaceId: string, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_ROAD, card: cardName});
  }

  // Having a custom addTile isn't ideal, but game.addTile is pretty specific, and this
  // isn't.
  public static addTile(player: Player, spaceId: string, tile: ITile): void {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const space = moonData.moon.getSpace(spaceId);
      if (!MOON_TILES.includes(tile.tileType)) {
        throw new Error(`Bad tile type for the moon: ${tile.tileType}`);
      }
      if (space.tile !== undefined) {
        throw new Error('Selected space is occupied');
      }

      // Note: Land Claim won't be accepted on the moon with this implementation.
      // which is OK for now.
      if (space.player !== undefined && space.player !== player) {
        throw new Error('This space is land claimed by ' + space.player.name);
      }

      space.tile = tile;
      space.player = player;
      // TODO(kberg): indicate that it's a moon space.
      LogHelper.logTilePlacement(player, space, tile.tileType);
    });
  }

  public static raiseMiningRate(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (moonData.miningRate < 8) {
        moonData.miningRate++;
        player.game.log('${0} raised the mining rate 1 step', (b) => b.player(player));
        player.increaseTerraformRatingSteps(1, player.game);
        this.activateLunaFirst(player, player.game);
      }
    });
  }

  public static raiseColonyRate(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (moonData.colonyRate < 8) {
        moonData.colonyRate++;
        player.game.log('${0} raised the moon colony rate 1 step', (b) => b.player(player));
        player.increaseTerraformRatingSteps(1, player.game);
        this.activateLunaFirst(player, player.game);
      }
    });
  }

  public static raiseLogisticRate(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (moonData.logisticRate < 8) {
        moonData.logisticRate++;
        player.game.log('${0} raised the logistic rate 1 step', (b) => b.player(player));
        player.increaseTerraformRatingSteps(1, player.game);
        this.activateLunaFirst(player, player.game);
      }
    });
  }

  private static activateLunaFirst(_sourcePlayer: Player | undefined, _game: Game) {
    // const lunaFirstPlayer = MoonExpansion.moonData(game).lunaFirstPlayer;
    // // TODO(kberg): Have raiseXRate accept a qty parameter so this doesn't log countless times.
    // if (lunaFirstPlayer !== undefined) {
    //   lunaFirstPlayer.megaCredits += 1;
    //   LogHelper.logGainStandardResource(game, lunaFirstPlayer, Resources.MEGACREDITS, 1);
    //   if (lunaFirstPlayer.id === sourcePlayer?.id) {
    //     lunaFirstPlayer.addProduction(Resources.MEGACREDITS, 1, game);
    //   }
    // }
  }

  // /*
  //  * Return the list of spaces on the board with a given tile type, optionally excluding
  //  * colony spaces.
  //  *
  //  * Special tiles such as Lunar Mine Urbanization, are especially included.
  //  */
  // public static tiles(game: Game, tileType: TileType, surfaceOnly: boolean = false): Array<ISpace> {
  //   let tiles: Array<ISpace> = [];
  //   MoonExpansion.ifMoon(game, (moonData) => {
  //     tiles = moonData.moon.spaces.filter(
  //       (space) => {
  //         const spaceTileType = space.tile?.tileType;
  //         let include: boolean = true;
  //         if (tileType === TileType.MOON_COLONY) {
  //           include = spaceTileType === TileType.MOON_COLONY || spaceTileType === TileType.LUNAR_MINE_URBANIZATION;
  //         } else if (tileType === TileType.MOON_MINE) {
  //           include = spaceTileType === TileType.MOON_MINE || spaceTileType === TileType.LUNAR_MINE_URBANIZATION;
  //         } else {
  //           include = include && space.tile?.tileType === tileType;
  //         }

  //         if (surfaceOnly) {
  //           include = include && space.spaceType !== SpaceType.COLONY;
  //         }

  //         return include;
  //       });
  //   });
  //   return tiles;
  // }

  /*
   * Reservation units adjusted for cards in a player's hand that might reduce or eliminate these costs.
   */
  public static adjustedReserveCosts(player: Player, card: IProjectCard) : Units {
    if (player.cardIsInEffect(CardName.LTF_PRIVILEGES) && card.tags.includes(Tags.MOON)) {
      return Units.EMPTY;
    }

    const reserveUnits: Units = card.reserveUnits || Units.EMPTY;

    let steel = reserveUnits.steel || 0;
    let titanium = reserveUnits.titanium || 0;

    const tilesBuilt: Array<TileType> = card.hasOwnProperty('tilesBuilt') ? ((card as unknown as IMoonCard).tilesBuilt || []) : [];

    if (tilesBuilt.includes(TileType.MOON_COLONY) && player.cardIsInEffect(CardName.SUBTERRANEAN_HABITATS)) {
      titanium -= 1;
    }

    if (tilesBuilt.includes(TileType.MOON_MINE) && player.cardIsInEffect(CardName.IMPROVED_MOON_CONCRETE)) {
      steel -= 1;
    }

    if (tilesBuilt.includes(TileType.MOON_ROAD) && player.cardIsInEffect(CardName.LUNAR_DUST_PROCESSING_PLANT)) {
      steel = 0;
    }

    steel = Math.max(steel, 0);
    titanium = Math.max(titanium, 0);
    return Units.of({steel, titanium});
  }
}
