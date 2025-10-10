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
import {MAXIMUM_MOON_RATE} from '../../common/constants';
import {Resource} from '../../common/Resource';
import {Phase} from '../../common/Phase';
import {BoardType} from '../boards/BoardType';
import {VictoryPointsBreakdownBuilder} from '../game/VictoryPointsBreakdownBuilder';
import {SpaceId} from '../../common/Types';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {Board} from '../boards/Board';

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

  // If the moon expansion is enabled, return with the game's MoonData instance, otherwise throw an error.
  public static moonData(game: IGame): MoonData {
    if (game.gameOptions.moonExpansion === true && game.moonData !== undefined) {
      return game.moonData;
    }
    throw new Error('Assertion error: Using a Moon feature when the Moon expansion is undefined.');
  }

  public static initialize(gameOptions: GameOptions, rng: Random): MoonData {
    return {
      moon: MoonBoard.newInstance(gameOptions, rng),
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
      for (const p of game.players) {
        for (const playedCard of p.tableau) {
          playedCard.onTilePlaced?.(p, player, space, BoardType.MOON);
        }
      }
    });
  }

  private static logTilePlacement(player: IPlayer, space: Space, tileType: TileType) {
    // TODO(kberg): this can probably be removed now.
    // Skip off-grid tiles
    if (space.x !== -1 && space.y !== -1) {
      player.game.log('${0} placed a ${1} tile at ${2}', (b) =>
        b.player(player).tileType(tileType).space(space));
    }
  }

  private static maybeBonus(originalRate: number, increment: number, value: number): boolean {
    return originalRate < value && originalRate + increment >= value;
  }

  private static RateData = {
    'mining': {field: 'miningRate', bonusAt6: Resource.TITANIUM},
    'habitat': {field: 'habitatRate', bonusAt6: Resource.ENERGY},
    'logistic': {field: 'logisticRate', bonusAt6: Resource.STEEL},
  } as const;

  private static raiseRate(player: IPlayer, count: number, field: 'mining' | 'logistic' | 'habitat') {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const rateData = MoonExpansion.RateData[field];
      // This relies on all three tracks being the same value. If they were different
      // that could be part of the structure.
      const available = MAXIMUM_MOON_RATE - moonData[rateData.field];
      const increment = Math.min(count, available);
      if (increment > 0) {
        if (player.game.phase === Phase.SOLAR) {
          player.game.log('${0} acted as World Government and raised the ' + field + ' rate ${1} step(s)', (b) => b.player(player).number(increment));
          this.activateLunaFirst(undefined, player.game, increment);
        } else {
          player.game.log('${0} raised the ' + field + ' rate ${1} step(s)', (b) => b.player(player).number(increment));
          player.increaseTerraformRating(increment);
          if (this.maybeBonus(moonData[rateData.field], increment, 3)) {
            player.drawCard();
          }
          if (this.maybeBonus(moonData[rateData.field], increment, 6)) {
            player.production.add(rateData.bonusAt6, 1, {log: true});
          }
          this.activateLunaFirst(player, player.game, increment);
        }
        moonData[rateData.field] += increment;
      }
    });
  }
  public static raiseMiningRate(player: IPlayer, count: number = 1) {
    this.raiseRate(player, count, 'mining');
  }

  public static raiseHabitatRate(player: IPlayer, count: number = 1) {
    this.raiseRate(player, count, 'habitat');
  }

  public static raiseLogisticRate(player: IPlayer, count: number = 1) {
    this.raiseRate(player, count, 'logistic');
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
    if (game.moonData === undefined) {
      return [];
    }
    return game.moonData.moon.spaces.filter(
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
          include = Board.spaceOwnedBy(space, options.ownedBy);
        }

        return include;
      });
  }

  /*
   * Reservation units adjusted for cards in a player's hand that might reduce or eliminate these costs.
   */
  public static adjustedReserveCosts(player: IPlayer, card: IProjectCard) : Units {
    // This is a bit hacky and uncoordinated only because this returns early when there's a moon card with LTF Privileges
    // even though the heat component below could be considered (and is, for LocalHeatTrapping.)

    if (player.tableau.has(CardName.LTF_PRIVILEGES) && card.tags.includes(Tag.MOON)) {
      return Units.EMPTY;
    }

    const reserveUnits: Units = card.reserveUnits || Units.EMPTY;

    const heat = reserveUnits.heat || 0;
    const plants = reserveUnits.plants || 0;
    let steel = reserveUnits.steel || 0;
    let titanium = reserveUnits.titanium || 0;

    for (const tileBuilt of card.tilesBuilt) {
      switch (tileBuilt) {
      case TileType.MOON_HABITAT:
        if (player.tableau.has(CardName.SUBTERRANEAN_HABITATS)) {
          // Edge case: Momentum Virum is a space habitat, not a habitat
          // ON the moon.
          if (card.name !== CardName.MOMENTUM_VIRUM_HABITAT) {
            titanium -= 1;
          }
        }
        break;

      case TileType.MOON_MINE:
        if (player.tableau.has(CardName.IMPROVED_MOON_CONCRETE)) {
          titanium -= 1;
        }
        break;

      case TileType.MOON_ROAD:
        if (player.tableau.has(CardName.LUNAR_DUST_PROCESSING_PLANT)) {
          steel = 0;
        }
      }
    }

    steel = Math.max(steel, 0);
    titanium = Math.max(titanium, 0);
    return Units.of({steel, titanium, heat, plants});
  }

  public static calculateVictoryPoints(player: IPlayer, builder: VictoryPointsBreakdownBuilder): void {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      // Each road tile on the map awards 1VP to the player owning it.
      // Each mine and colony (habitat) tile on the map awards 1VP per road tile touching them.
      const moon = moonData.moon;
      const mySpaces = moon.spaces.filter(Board.ownedBy(player));
      for (const space of mySpaces) {
        if (space.tile !== undefined) {
          const type = space.tile.tileType;
          switch (type) {
          case TileType.MOON_ROAD:
            builder.setVictoryPoints('moon road', 1);
            break;
          case TileType.MOON_MINE:
          case TileType.MOON_HABITAT:
          case TileType.LUNAR_MINE_URBANIZATION:
            const points = moon.getAdjacentSpaces(space).filter((adj) => MoonExpansion.spaceHasType(adj, TileType.MOON_ROAD)).length;
            if (type === TileType.MOON_MINE || type === TileType.LUNAR_MINE_URBANIZATION) {
              builder.setVictoryPoints('moon mine', points);
            }
            if (type === TileType.MOON_HABITAT || type === TileType.LUNAR_MINE_URBANIZATION) {
              builder.setVictoryPoints('moon habitat', points);
            }
            break;
          }
        }
      }
    });
  }
}
