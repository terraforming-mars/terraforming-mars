import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Board} from '../boards/Board';
import {SpaceType} from '../../common/boards/SpaceType';
import {byKey, Comparator, compound, reversed} from '../../common/utils/Ordering';

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
      const cities = board.getAdjacentSpaces(space).filter(Board.isCitySpace);
      const marsBotCities = cities.filter(Board.ownedBy(this.marsBot));
      const humanCities = cities.filter(Board.ownedBy(this.humanPlayer));
      // Maximize MarsBot cities adjacency, then minimize human cities adjacency
      return marsBotCities.length * 100 - humanCities.length;
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

  /**
   * Find the best space for MarsBot to place a city next to at least two greenery or ocean tiles.
   * This is what the Expedited Construction bonus card (B05) asks for.
   */
  public findExpeditedConstructionCitySpace(): Space | undefined {
    const board = this.game.board;
    const adjacentGreeneryOrOcean = (space: Space) => board.getAdjacentSpaces(space)
      .filter((s) => Board.isGreenerySpace(s) || Board.isOceanSpace(s)).length;

    const eligible = board.getAvailableSpacesForCity(this.marsBot)
      .filter((space) => adjacentGreeneryOrOcean(space) >= 2);
    if (eligible.length === 0) {
      return undefined;
    }

    return this.selectBestSpace(eligible, adjacentGreeneryOrOcean);
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
      return !adj.some((s) => s.spaceType === SpaceType.OCEAN || s.spaceType === SpaceType.RESTRICTED);
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

    const scored = spaces.map((space) => ({
      space,
      primary: primaryScore(space),
      adjacentOceans: this.game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace).length,
      bonusIcons: space.bonus.length,
    }));

    // Sort by primary descending, then adjacent oceans descending, then bonus icons descending
    const ranking: Comparator<(typeof scored)[number]> =
      reversed(compound(
        byKey('primary'),
        byKey('adjacentOceans'),
        byKey('bonusIcons')));
    scored.sort(ranking);

    // Find all tied for best
    const best = scored[0];
    const tied = scored.filter((s) => ranking(s, best) === 0);

    if (tied.length === 1) {
      return tied[0].space;
    }

    // Tiebreaker 3: random using project deck card cost
    return this.randomTiebreak(tied.map((t) => t.space));
  }

  /** Break a tie by flipping a project card and counting through spaces. */
  private randomTiebreak(spaces: ReadonlyArray<Space>): Space {
    const card = this.game.projectDeck.drawOrThrow(this.game);
    this.game.projectDeck.discard(card);
    return spaces[card.cost % spaces.length];
  }

  /** Calculate MC MarsBot gains from placement bonuses (1 MC per icon covered). */
  public getPlacementBonusMC(space: Space): number {
    return space.bonus.length; // 1 MC per icon
  }

  /** Calculate MC MarsBot gains from ocean adjacency (2 MC per adjacent ocean). */
  public getOceanAdjacencyMC(space: Space): number {
    const oceans = this.game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace).length;
    return oceans * 2;
  }

  /** Total placement MC for MarsBot: 1 MC per bonus icon + 2 MC per adjacent ocean. */
  public getTotalPlacementMC(space: Space): number {
    return this.getPlacementBonusMC(space) + this.getOceanAdjacencyMC(space);
  }
}
