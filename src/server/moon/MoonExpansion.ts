import {IGame} from '../IGame';
import {Tile} from '../Tile';
import {MoonBoard} from './MoonBoard';
import {IPlayer} from '../IPlayer';
import {TileType} from '../../common/TileType';
import {SpaceType} from '../../common/boards/SpaceType';
import {MoonData} from './MoonData';
import {CardName} from '../../common/cards/CardName';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../../common/Units';
import {Tag} from '../../common/cards/Tag';
import {Space} from '../boards/Space';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE} from '../../common/constants';
import {Resource} from '../../common/Resource';
import {Phase} from '../../common/Phase';
import {BoardType} from '../boards/BoardType';
import {VictoryPointsBreakdown} from '../game/VictoryPointsBreakdown';
import {SpaceId} from '../../common/Types';

export class MoonExpansion {
  public static readonly MOON_TILES: Set<TileType> = new Set([
    TileType.MOON_MINE,
    TileType.MOON_HABITAT,
    TileType.MOON_ROAD,
    TileType.LUNA_TRADE_STATION,
    TileType.LUNA_MINING_HUB,
    TileType.LUNA_TRAIN_STATION,
    TileType.LUNAR_MINE_URBANIZATION,
  ]);

  private constructor() {
  }

  // If the moon expansion is enabled, execute this callback, otherwise do nothing.
  public static ifMoon<T>(game: IGame, cb: (moonData: MoonData) => T): T | undefined {
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
  public static ifElseMoon<T>(game: IGame, cb: (moonData: MoonData) => T, elseCb: () => T): T {
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
  public static moonData(game: IGame): MoonData {
    if (game.gameOptions.moonExpansion === true && game.moonData !== undefined) {
      return game.moonData;
    }
    throw new Error('Assertion error: Using a Moon feature when the Moon expansion is undefined.');
  }

  public static initialize(): MoonData {
    return {
      moon: MoonBoard.newInstance(),
      habitatRate: 0,
      miningRate: 0,
      logisticRate: 0,
      lunaFirstPlayer: undefined,
      lunaProjectOfficeLastGeneration: undefined,
    };
  }

  public static addMineTile(
    player: IPlayer, spaceId: SpaceId, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_MINE, card: cardName});
  }

  public static addHabitatTile(
    player: IPlayer, spaceId: SpaceId, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_HABITAT, card: cardName});
  }

  public static addRoadTile(
    player: IPlayer, spaceId: SpaceId, cardName: CardName | undefined = undefined): void {
    MoonExpansion.addTile(player, spaceId, {tileType: TileType.MOON_ROAD, card: cardName});
  }

  // Having a custom addTile isn't ideal, but game.addTile is pretty specific, and this
  // isn't.

  // Update: I think this is going to have to merge with addTile. It won't be bad.
  public static addTile(player: IPlayer, spaceId: SpaceId, tile: Tile): void {
    const game = player.game;
    MoonExpansion.ifMoon(game, (moonData) => {
      const space = moonData.moon.getSpaceOrThrow(spaceId);
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
      game.getPlayers().forEach((p) => {
        p.tableau.forEach((playedCard) => {
          playedCard.onTilePlaced?.(p, player, space, BoardType.MOON);
        });
      });
    });
  }

  private static logTilePlacement(player: IPlayer, space: Space, tileType: TileType) {
    // Skip off-grid tiles
    if (space.x !== -1 && space.y !== -1) {
      const offsets = [-1, 0, 1, 1, 1, 0, -1];
      const row = space.y + 1;
      const position = space.x + offsets[space.y];

      player.game.log('${0} placed a ${1} tile on The Moon at (${2}, ${3})', (b) =>
        b.player(player).tileType(tileType).number(row).number(position));
    }
  }

  private static bonus(originalRate: number, increment: number, value: number, cb: () => void): void {
    if (originalRate < value && originalRate + increment >= value) {
      cb();
    }
  }

  public static raiseMiningRate(player: IPlayer, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_MINING_RATE - moonData.miningRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the mining rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, increment);
        } else {
          player.game.log('${0} raised the mining rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRating(increment);
          this.bonus(moonData.miningRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.miningRate, increment, 6, () => {
            player.production.add(Resource.TITANIUM, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, increment);
        }
        moonData.miningRate += increment;
      }
    });
  }

  public static raiseHabitatRate(player: IPlayer, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_HABITAT_RATE - moonData.habitatRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the habitat rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, count);
        } else {
          player.game.log('${0} raised the habitat rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRating(increment);
          this.bonus(moonData.habitatRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.habitatRate, increment, 6, () => {
            player.production.add(Resource.ENERGY, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, count);
        }
        moonData.habitatRate += increment;
      }
    });
  }

  public static raiseLogisticRate(player: IPlayer, count: number = 1) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const available = MAXIMUM_LOGISTICS_RATE - moonData.logisticRate;
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the logistic rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, increment);
        } else {
          player.game.log('${0} raised the logistic rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRating(increment);
          this.bonus(moonData.logisticRate, increment, 3, () => {
            player.drawCard();
          });
          this.bonus(moonData.logisticRate, increment, 6, () => {
            player.production.add(Resource.STEEL, 1, {log: true});
          });
          this.activateLunaFirst(player, player.game, increment);
        }
        moonData.logisticRate += increment;
      }
    });
  }

  private static activateLunaFirst(sourcePlayer: IPlayer | undefined, game: IGame, count: number) {
    const lunaFirstPlayer = MoonExpansion.moonData(game).lunaFirstPlayer;
    if (lunaFirstPlayer !== undefined) {
      lunaFirstPlayer.stock.add(Resource.MEGACREDITS, count, {log: true});
      if (lunaFirstPlayer.id === sourcePlayer?.id) {
        lunaFirstPlayer.production.add(Resource.MEGACREDITS, count, {log: true});
      }
    }
  }

  public static lowerMiningRate(player: IPlayer, count: number) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const increment = Math.min(moonData.miningRate, count);
      moonData.miningRate -= increment;
      player.game.log('${0} lowered the mining rate ${1} step(s)', (b) => b.player(player).number(increment));
    });
  }

  public static lowerHabitatRate(player: IPlayer, count: number) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const increment = Math.min(moonData.habitatRate, count);
      moonData.habitatRate -= increment;
      player.game.log('${0} lowered the habitat rate ${1} step(s)', (b) => b.player(player).number(increment));
    });
  }

  public static lowerLogisticRate(player: IPlayer, count: number) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const increment = Math.min(moonData.logisticRate, count);
      moonData.logisticRate -= increment;
      player.game.log('${0} lowered the logistic rate ${1} step(s)', (b) => b.player(player).number(increment));
    });
  }

  // Use this to test whether a space has a given moon tile type rather than
  // testing tiletype directly. It takes into account Lunar Mine Urbanization.
  public static spaceHasType(space: Space, type: TileType, upgradedTiles: boolean = true): boolean {
    if (space.tile === undefined) {
      return false;
    }
    if (space.tile.tileType === type) {
      return true;
    }
    if (upgradedTiles && space.tile.tileType === TileType.LUNAR_MINE_URBANIZATION) {
      return type === TileType.MOON_HABITAT || type === TileType.MOON_MINE;
    }
    return false;
  }

  /*
   * Return the list of spaces on the board with a given tile type, optionally excluding
   * colony spaces.
   *
   * Special tiles such as Lunar Mine Urbanization, are especially included.
   */
  public static spaces(
    game: IGame,
    tileType?: TileType,
    options?: {
      surfaceOnly?: boolean,
      ownedBy? : IPlayer,
      upgradedTiles?: boolean,
    }): Array<Space> {
    return MoonExpansion.ifElseMoon(game, (moonData) => {
      return moonData.moon.spaces.filter(
        (space) => {
          if (space.tile === undefined) {
            return false;
          }
          let include = true;
          if (tileType) {
            include = MoonExpansion.spaceHasType(space, tileType, options?.upgradedTiles);
          }
          if (include && options?.surfaceOnly) {
            include = space.spaceType !== SpaceType.COLONY;
          }
          if (include && options?.ownedBy !== undefined) {
            include = space.player === options.ownedBy || space.coOwner === options.ownedBy;
          }

          return include;
        });
    }, () => []);
  }

  /*
   * Reservation units adjusted for cards in a player's hand that might reduce or eliminate these costs.
   */
  public static adjustedReserveCosts(player: IPlayer, card: IProjectCard) : Units {
    // This is a bit hacky and uncoordinated only because this returns early when there's a moon card with LTF Privileges
    // even though the heat component below could be considered (and is, for LocalHeatTrapping.)

    if (player.cardIsInEffect(CardName.LTF_PRIVILEGES) && card.tags.includes(Tag.MOON)) {
      return Units.EMPTY;
    }

    const reserveUnits: Units = card.reserveUnits || Units.EMPTY;

    const heat = reserveUnits.heat || 0;
    let steel = reserveUnits.steel || 0;
    let titanium = reserveUnits.titanium || 0;

    for (const tileBuilt of card.tilesBuilt) {
      switch (tileBuilt) {
      case TileType.MOON_HABITAT:
        if (player.cardIsInEffect(CardName.SUBTERRANEAN_HABITATS)) {
          titanium -= 1;
        }
        break;

      case TileType.MOON_MINE:
        if (player.cardIsInEffect(CardName.IMPROVED_MOON_CONCRETE)) {
          titanium -= 1;
        }
        break;

      case TileType.MOON_ROAD:
        if (player.cardIsInEffect(CardName.LUNAR_DUST_PROCESSING_PLANT)) {
          steel = 0;
        }
      }
    }

    steel = Math.max(steel, 0);
    titanium = Math.max(titanium, 0);
    return Units.of({steel, titanium, heat});
  }

  public static calculateVictoryPoints(player: IPlayer, vpb: VictoryPointsBreakdown): void {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      // Each road tile on the map awards 1VP to the player owning it.
      // Each mine and colony (habitat) tile on the map awards 1VP per road tile touching them.
      const moon = moonData.moon;
      const mySpaces = moon.spaces.filter((space) => space.player?.id === player.id || space.coOwner?.id === player.id);
      mySpaces.forEach((space) => {
        if (space.tile !== undefined) {
          const type = space.tile.tileType;
          switch (type) {
          case TileType.MOON_ROAD:
            vpb.setVictoryPoints('moon road', 1);
            break;
          case TileType.MOON_MINE:
          case TileType.MOON_HABITAT:
          case TileType.LUNAR_MINE_URBANIZATION:
            const points = moon.getAdjacentSpaces(space).filter((adj) => MoonExpansion.spaceHasType(adj, TileType.MOON_ROAD)).length;
            if (type === TileType.MOON_MINE || type === TileType.LUNAR_MINE_URBANIZATION) {
              vpb.setVictoryPoints('moon mine', points);
            }
            if (type === TileType.MOON_HABITAT || type === TileType.LUNAR_MINE_URBANIZATION) {
              vpb.setVictoryPoints('moon habitat', points);
            }
            break;
          }
        }
      });
    });
  }
}
