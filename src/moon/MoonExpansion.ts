import {Game} from '../Game';
import {ITile} from '../ITile';
import {MoonBoard} from './MoonBoard';
import {Player} from '../Player';
import {TileType} from '../TileType';
import {SpaceType} from '../SpaceType';
import {IMoonData} from './IMoonData';
import {CardName} from '../CardName';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../Units';
import {IMoonCard} from '../cards/moon/IMoonCard';
import {Tags} from '../cards/Tags';
import {ISpace} from '../boards/ISpace';
import {MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE} from '../constants';
import {Resources} from '../Resources';
import {Phase} from '../Phase';
import {BoardType} from '../boards/BoardType';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';

// export interface CoOwnedSpace {
//   spaceId: string;
//   coOwner: PlayerId;
// }

export class MoonExpansion {
  public static readonly MOON_TILES: Set<TileType> = new Set([
    TileType.MOON_MINE,
    TileType.MOON_COLONY,
    TileType.MOON_ROAD,
    TileType.LUNA_TRADE_STATION,
    TileType.LUNA_MINING_HUB,
    TileType.LUNA_TRAIN_STATION,
    TileType.LUNAR_MINE_URBANIZATION,
  ]);

  private constructor() {
  }

  // If the moon expansion is enabled, execute this callback, otherwise do nothing.
  public static ifMoon<T>(game: Game, cb: (moonData: IMoonData) => T): T | undefined {
    if (game.gameOptions.moonExpansion) {
      if (game.moonData === undefined) {
        console.log(`Assertion failure: game.moonData is undefined for ${game.id}`);
      } else {
        return cb(game.moonData);
      }
    }
    return undefined;
  }

  // If the moon expansion is enabled, execute this callback, otherwise execute the else callback.
  public static ifElseMoon<T>(game: Game, cb: (moonData: IMoonData) => T, elseCb: () => T): T {
    if (game.gameOptions.moonExpansion) {
      if (game.moonData === undefined) {
        console.log(`Assertion failure: game.moonData is undefined for ${game.id}`);
      } else {
        return cb(game.moonData);
      }
    }
    return elseCb();
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
      lunaProjectOfficeLastGeneration: undefined,
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

  // Update: I think this is going to have to merge with addTile. It won't be bad.
  public static addTile(player: Player, spaceId: string, tile: ITile): void {
    const game = player.game;
    MoonExpansion.ifMoon(game, (moonData) => {
      const space = moonData.moon.getSpace(spaceId);
      if (!this.MOON_TILES.has(tile.tileType)) {
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
      if (player.game.phase !== Phase.SOLAR) {
        space.player = player;
      }

      if (game.phase !== Phase.SOLAR) {
        space.bonus.forEach((spaceBonus) => {
          game.grantSpaceBonus(player, spaceBonus);
        });
      }

      MoonExpansion.logTilePlacement(player, space, tile.tileType);

      // Ideally, this should be part of game.addTile, but since it isn't it's convenient enough to
      // hard-code onTilePlaced here. I wouldn't be surprised if this introduces a problem, but for now
      // it's not a problem until it is.
      if (player.corporationCard !== undefined && player.corporationCard.onTilePlaced !== undefined) {
        player.corporationCard.onTilePlaced(player, player, space, BoardType.MOON);
      }
    });
  }

  private static logTilePlacement(player: Player, space: ISpace, tileType: TileType) {
    // Skip off-grid tiles
    if (space.x !== -1 && space.y !== -1) {
      const offsets = [-1, 0, 1, 1, 1, 0, -1];
      const row: number = space.y + 1;
      const position: number = space.x + offsets[space.y];

      player.game.log('${0} placed a ${1} tile on the Moon at (${2}, ${3})', (b) =>
        b.player(player).string(TileType.toString(tileType)).number(row).number(position));
    }
  }

  private static bonus(originalRate: number, increment: number, value: number, cb: () => void): void {
    if (originalRate < value && originalRate + increment >= value) {
      cb();
    }
  }

  public static raiseMiningRate(player: Player, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_MINING_RATE - moonData.miningRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the mining rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, increment);
        } else {
          player.game.log('${0} raised the mining rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRatingSteps(increment);
          this.bonus(moonData.miningRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.miningRate, increment, 6, () => {
            player.addProduction(Resources.TITANIUM, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, increment);
        }
        moonData.miningRate += increment;
      }
    });
  }

  public static raiseColonyRate(player: Player, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_COLONY_RATE - moonData.colonyRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the colony rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, count);
        } else {
          player.game.log('${0} raised the moon colony rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRatingSteps(count);
          this.bonus(moonData.colonyRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.colonyRate, increment, 6, () => {
            player.addProduction(Resources.ENERGY, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, count);
        }
        moonData.colonyRate += increment;
      }
    });
  }

  public static raiseLogisticRate(player: Player, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_LOGISTICS_RATE - moonData.logisticRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the logistic rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, increment);
        } else {
          player.game.log('${0} raised the logistic rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRatingSteps(count);
          this.bonus(moonData.logisticRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.logisticRate, increment, 6, () => {
            player.addProduction(Resources.STEEL, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, increment);
        }
        moonData.logisticRate += increment;
      }
    });
  }

  private static activateLunaFirst(sourcePlayer: Player | undefined, game: Game, count: number) {
    const lunaFirstPlayer = MoonExpansion.moonData(game).lunaFirstPlayer;
    if (lunaFirstPlayer !== undefined) {
      lunaFirstPlayer.addResource(Resources.MEGACREDITS, count, {log: true});
      if (lunaFirstPlayer.id === sourcePlayer?.id) {
        lunaFirstPlayer.addProduction(Resources.MEGACREDITS, count, {log: true});
      }
    }
  }

  // Use this to test whether a space has a given moon tile type rather than
  // testing tiletype directly. It takes into account Lunar Mine Urbanization.
  public static spaceHasType(space: ISpace, type: TileType): boolean {
    if (space.tile === undefined) {
      return false;
    }
    if (space.tile.tileType === type) {
      return true;
    }
    if (space.tile.tileType === TileType.LUNAR_MINE_URBANIZATION) {
      return type === TileType.MOON_COLONY || type === TileType.MOON_MINE;
    }
    return false;
  }

  /*
   * Return the list of spaces on the board with a given tile type, optionally excluding
   * colony spaces.
   *
   * Special tiles such as Lunar Mine Urbanization, are especially included.
   */
  public static tiles(
    game: Game,
    tileType?: TileType,
    options?: {
      surfaceOnly?: boolean,
      ownedBy? : Player
    }): Array<ISpace> {
    return MoonExpansion.ifElseMoon(game, (moonData) => {
      return moonData.moon.spaces.filter(
        (space) => {
          if (space.tile === undefined) {
            return false;
          }
          let include: boolean = true;
          if (tileType) {
            include = MoonExpansion.spaceHasType(space, tileType);
          }
          if (include && options?.surfaceOnly) {
            include = space.spaceType !== SpaceType.COLONY;
          }

          if (include && options?.ownedBy !== undefined) {
            include = space.player === options?.ownedBy;
          }

          return include;
        });
    }, () => []);
  }

  /*
   * Reservation units adjusted for cards in a player's hand that might reduce or eliminate these costs.
   */
  public static adjustedReserveCosts(player: Player, card: IProjectCard) : Units {
    // This is a bit hacky and uncoordinated only because this returns early when there's a moon card with LTF Privileges
    // even though the heat component below could be considered (and is, for LocalHeatTrapping.)

    if (player.cardIsInEffect(CardName.LTF_PRIVILEGES) && card.tags.includes(Tags.MOON)) {
      return Units.EMPTY;
    }

    const reserveUnits: Units = card.reserveUnits || Units.EMPTY;

    const heat = reserveUnits.heat || 0;
    let steel = reserveUnits.steel || 0;
    let titanium = reserveUnits.titanium || 0;

    const tilesBuilt: Array<TileType> = (card as unknown as IMoonCard).tilesBuilt || [];

    if (tilesBuilt.includes(TileType.MOON_COLONY) && player.cardIsInEffect(CardName.SUBTERRANEAN_HABITATS)) {
      titanium -= 1;
    }

    if (tilesBuilt.includes(TileType.MOON_MINE) && player.cardIsInEffect(CardName.IMPROVED_MOON_CONCRETE)) {
      titanium -= 1;
    }

    if (tilesBuilt.includes(TileType.MOON_ROAD) && player.cardIsInEffect(CardName.LUNAR_DUST_PROCESSING_PLANT)) {
      steel = 0;
    }

    steel = Math.max(steel, 0);
    titanium = Math.max(titanium, 0);
    return Units.of({steel, titanium, heat});
  }

  public static calculateVictoryPoints(player: Player, vpb: VictoryPointsBreakdown): void {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      // Each road tile on the map awards 1VP to the player owning it.
      // Each mine and colony (habitat) tile on the map awards 1VP per road tile touching them.
      const moon = moonData.moon;
      const mySpaces = moon.spaces.filter((space) => space.player?.id === player.id);
      mySpaces.forEach((space) => {
        if (space.tile !== undefined) {
          const type = space.tile.tileType;
          switch (type) {
          case TileType.MOON_ROAD:
            vpb.setVictoryPoints('moon road', 1);
            break;
          case TileType.MOON_MINE:
          case TileType.MOON_COLONY:
          case TileType.LUNAR_MINE_URBANIZATION:
            const points = moon.getAdjacentSpaces(space).filter((adj) => MoonExpansion.spaceHasType(adj, TileType.MOON_ROAD)).length;
            if (type === TileType.MOON_MINE || type === TileType.LUNAR_MINE_URBANIZATION) {
              vpb.setVictoryPoints('moon mine', points);
            }
            if (type === TileType.MOON_COLONY || type === TileType.LUNAR_MINE_URBANIZATION) {
              vpb.setVictoryPoints('moon colony', points);
            }
            break;
          }
        }
      });
    });
  }
}
