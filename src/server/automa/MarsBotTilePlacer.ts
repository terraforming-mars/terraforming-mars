import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Board} from '../boards/Board';
import {SpaceType} from '../../common/boards/SpaceType';

/**
 * Handles MarsBot tile placement with automa-specific rules and tiebreakers.
 *
 * Greenery: Adjacent to as many MarsBot cities as possible, minimize adjacency to human cities.
 * City: Adjacent to as much existing greenery as possible. Standard city rules.
 * Ocean: Any ocean-reserved space.
 *
 * Tiebreakers (after type-specific rules):
 *   1. Adjacent to as many oceans as possible.
 *   2. Cover the most placement bonus icons.
 *   3. Random (flip a project card, use cost to count through tied spaces).
 */
export class MarsBotTilePlacer {
  constructor(
    private readonly game: IGame,
    private readonly marsBot: IPlayer,
    private readonly humanPlayer: IPlayer,
  ) {}

  /** Find the best space for MarsBot to place a greenery. Returns undefined if none available. */
  public findGreenerySpace(): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesForGreenery(this.marsBot);
    if (spaces.length === 0) {
      return undefined;
    }

    return this.selectBestSpace(spaces, (space) => {
      const adj = board.getAdjacentSpaces(space);
      const marsBotCities = adj.filter((s) => s.player === this.marsBot && Board.isCitySpace(s)).length;
      const humanCities = adj.filter((s) => s.player === this.humanPlayer && Board.isCitySpace(s)).length;
      // Maximize MarsBot cities adjacency, then minimize human cities adjacency
      return marsBotCities * 100 - humanCities;
    });
  }

  /** Find the best space for MarsBot to place a city. Returns undefined if none available. */
  public findCitySpace(): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesForCity(this.marsBot);
    if (spaces.length === 0) {
      return undefined;
    }

    return this.selectBestSpace(spaces, (space) => {
      const adj = board.getAdjacentSpaces(space);
      return adj.filter((s) => Board.isGreenerySpace(s)).length;
    });
  }

  /** Find the best space for MarsBot to place a city adjacent to ≥2 greenery/ocean tiles (B05). */
  public findExpediteConstructionCitySpace(): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesForCity(this.marsBot);
    const eligible = spaces.filter((space) => {
      const adj = board.getAdjacentSpaces(space);
      const greeneryOrOcean = adj.filter((s) =>
        Board.isGreenerySpace(s) || Board.isOceanSpace(s),
      ).length;
      return greeneryOrOcean >= 2;
    });
    if (eligible.length === 0) {
      return undefined;
    }

    return this.selectBestSpace(eligible, (space) => {
      const adj = board.getAdjacentSpaces(space);
      return adj.filter((s) =>
        Board.isGreenerySpace(s) || Board.isOceanSpace(s),
      ).length;
    });
  }

  /** Find the best space for MarsBot to place an ocean. Returns undefined if none available. */
  public findOceanSpace(): Space | undefined {
    const spaces = this.game.board.getAvailableSpacesForOcean(this.marsBot);
    if (spaces.length === 0) {
      return undefined;
    }
    // Oceans have no type-specific primary sort, go straight to tiebreakers.
    return this.selectBestSpace(spaces, () => 0);
  }

  /** Find a space for the Neural Instance tile: not adjacent to any tiles, not on edge, not on/adjacent to reserved spaces. */
  public findNeuralInstanceSpace(): Space | undefined {
    const board = this.game.board;
    const isReserved = (s: Space) => s.spaceType === SpaceType.OCEAN || s.spaceType === SpaceType.RESTRICTED;
    const spaces = board.getAvailableSpacesOnLand(this.marsBot).filter((space) => {
      const adj = board.getAdjacentSpaces(space);
      // Adjacent to no tiles
      if (adj.some((s) => s.tile !== undefined)) {
        return false;
      }
      // Not on edge (has fewer than 6 adjacent spaces means edge)
      if (adj.length < 6) {
        return false;
      }
      // Not adjacent to reserved spaces (ocean-reserved, restricted, specific cities)
      if (adj.some(isReserved)) {
        return false;
      }
      // Not on a reserved space itself
      if (isReserved(space)) {
        return false;
      }
      return true;
    });
    if (spaces.length === 0) {
      return undefined;
    }
    return this.selectBestSpace(spaces, () => 0);
  }

  /**
   * Select the best space from candidates using:
   * 1. primaryScore function (type-specific)
   * 2. Tiebreaker 1: adjacent oceans
   * 3. Tiebreaker 2: number of placement bonus icons
   * 4. Tiebreaker 3: random (using project deck card cost)
   */
  private selectBestSpace(
    spaces: ReadonlyArray<Space>,
    primaryScore: (space: Space) => number,
  ): Space | undefined {
    if (spaces.length === 0) {
      return undefined;
    }
    if (spaces.length === 1) {
      return spaces[0];
    }

    const board = this.game.board;

    const scored = spaces.map((space) => ({
      space,
      primary: primaryScore(space),
      adjacentOceans: board.getAdjacentSpaces(space).filter((s) => Board.isOceanSpace(s) && s.tile !== undefined).length,
      bonusIcons: space.bonus.length,
    }));

    // Sort by primary desc, then adjacent oceans desc, then bonus icons desc
    scored.sort((a, b) => {
      if (a.primary !== b.primary) {
        return b.primary - a.primary;
      }
      if (a.adjacentOceans !== b.adjacentOceans) {
        return b.adjacentOceans - a.adjacentOceans;
      }
      return b.bonusIcons - a.bonusIcons;
    });

    // Find all tied for best
    const best = scored[0];
    const tied = scored.filter((s) =>
      s.primary === best.primary &&
      s.adjacentOceans === best.adjacentOceans &&
      s.bonusIcons === best.bonusIcons,
    );

    if (tied.length === 1) {
      return tied[0].space;
    }

    // Tiebreaker 3: random using project deck card cost
    return this.randomTiebreak(tied.map((t) => t.space));
  }

  /** Break a tie by flipping a project card and counting through spaces. */
  private randomTiebreak(spaces: ReadonlyArray<Space>): Space {
    const card = this.game.projectDeck.draw(this.game);
    const cost = card?.cost ?? 0;
    if (card) {
      this.game.projectDeck.discardPile.push(card);
    }
    const index = cost % spaces.length;
    return spaces[index];
  }

  /** Calculate MC MarsBot gains from placement bonuses (1 MC per icon covered). */
  public getPlacementBonusMC(space: Space): number {
    return space.bonus.length; // 1 MC per icon
  }

  /** Calculate MC MarsBot gains from ocean adjacency (2 MC per adjacent ocean). */
  public getOceanAdjacencyMC(space: Space): number {
    const adj = this.game.board.getAdjacentSpaces(space);
    const oceans = adj.filter((s) => Board.isOceanSpace(s) && s.tile !== undefined).length;
    return oceans * 2;
  }

  /** Total placement MC for MarsBot: 1 MC per bonus icon + 2 MC per adjacent ocean. */
  public getTotalPlacementMC(space: Space): number {
    return this.getPlacementBonusMC(space) + this.getOceanAdjacencyMC(space);
  }
}
