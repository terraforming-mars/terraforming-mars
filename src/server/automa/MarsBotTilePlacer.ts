import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Board, isSpecialTileSpace} from '../boards/Board';
import {SpaceType} from '../../common/boards/SpaceType';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardName} from '../../common/boards/BoardName';
import {Comparator, comparing, compound, reversed} from '../../common/utils/Ordering';

/**
 * Scores a space for one tiebreaker.
 *
 * The higher score wins.
 */
type Scorer = (space: Space) => number;
type TiebreakerName = 'oceans' | 'icons' | 'polarRegion' | 'southernRegion' | 'specialTiles' | 'edge';

/** The tiebreakers of Tharsis, and of any map `MAP_TIEBREAKERS` doesn't list. */
const DEFAULT_TIEBREAKERS: ReadonlyArray<TiebreakerName> = ['oceans', 'icons'];

/**
 * The tiebreakers each map's player aid lists, in order.
 *
 * The flipped project card always comes last (rulebook C, p.10).
 */
const MAP_TIEBREAKERS: Partial<Record<BoardName, ReadonlyArray<TiebreakerName>>> = {
  [BoardName.HELLAS]: ['oceans', 'polarRegion', 'icons'],
  [BoardName.ELYSIUM]: ['oceans', 'icons', 'southernRegion'],
  [BoardName.TERRA_CIMMERIA_NOVA]: ['oceans', 'specialTiles', 'icons'],
  [BoardName.UTOPIA_PLANITIA]: ['oceans', 'icons'],
  // The aid reads "edge spaces, if possible, otherwise adjacent to as many oceans as possible".
  // The oceans are the next tiebreaker, so they also decide between edge spaces.
  [BoardName.VASTITAS_BOREALIS_NOVA]: ['icons', 'edge', 'oceans'],
};

/**
 * Handles MarsBot tile placement with automa-specific rules and tiebreakers.
 *
 * Greenery: Adjacent to as many MarsBot cities as possible, less the human's adjacent cities.
 * City: Adjacent to as much existing greenery as possible. Standard city rules.
 * Ocean: Any ocean-reserved space.
 *
 * Tiebreakers (after type-specific rules), on Tharsis:
 *   1. Adjacent to as many oceans as possible.
 *   2. Cover the most placement bonus icons.
 *   3. Random (flip a project card, use cost to count through tied spaces).
 *
 * The other maps reorder these and add their own, see `MAP_TIEBREAKERS`.
 */
export class MarsBotTilePlacer {
  constructor(
    private readonly game: IGame,
    private readonly botPlayer: IPlayer,
    private readonly humanPlayer: IPlayer,
  ) {}

  /**
   * The tiebreakers on the player aid MarsBot uses, in order.
   *
   * That is the map's own aid, or the Tharsis aid with the Milestones & Awards expansion (rulebook C,
   * p.13). With the Highlander award in play, "adjacent to ocean" comes just after the reward icons
   * (rulebook C, p.15).
   */
  private tiebreakerNames(): ReadonlyArray<TiebreakerName> {
    const options = this.game.gameOptions;
    const names = options.modularMA ? DEFAULT_TIEBREAKERS : (MAP_TIEBREAKERS[options.boardName] ?? DEFAULT_TIEBREAKERS);
    if (this.game.awards.some((award) => award.name === 'Highlander')) {
      return oceansAfterIcons(names);
    }
    return names;
  }

  /** Find the best space for MarsBot to place a greenery. Returns undefined if none available. */
  public findGreenerySpace(): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesForGreenery(this.botPlayer);
    if (spaces.length === 0) {
      return undefined;
    }

    return this.selectBestSpace(spaces, (space) => {
      const cities = board.getAdjacentSpaces(space).filter(Board.isCitySpace);
      const marsBotCities = cities.filter(Board.ownedBy(this.botPlayer));
      const humanCities = cities.filter(Board.ownedBy(this.humanPlayer));
      // MarsBot's adjacent cities minus the human's. The greenery gives 1 VP to the owner of each
      // adjacent city, so the highest score is the space with the best net VP for MarsBot.
      // https://boardgamegeek.com/thread/3350125/article/44711805#44711805 (njshaw2)
      // https://boardgamegeek.com/thread/3411375/article/45234897#45234897 (njshaw2, ties are random)
      return marsBotCities.length - humanCities.length;
    });
  }

  /**
   * Find the best space for MarsBot to place a city. Returns undefined if none available.
   *
   * @param filter limits the choice to the legal city spaces it accepts.
   */
  public findCitySpace(filter: (space: Space) => boolean = () => true): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesForCity(this.botPlayer).filter(filter);
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
   *
   * Among those spaces the usual city rule picks, so 2 greeneries beat 3 oceans. The card's
   * wording wins over the rulebook's "most tiles of these types". The card's author (TDaver):
   * https://boardgamegeek.com/thread/3350125/article/44720677#44720677
   */
  public findExpeditedConstructionCitySpace(): Space | undefined {
    const board = this.game.board;
    const adjacentGreeneryOrOcean = (space: Space) => board.getAdjacentSpaces(space)
      .filter((s) => Board.isGreenerySpace(s) || Board.isOceanSpace(s)).length;
    return this.findCitySpace((space) => adjacentGreeneryOrOcean(space) >= 2);
  }

  /** Find the best space for MarsBot to place an ocean. Returns undefined if none available. */
  public findOceanSpace(): Space | undefined {
    const spaces = this.game.board.getAvailableSpacesForOcean(this.botPlayer);
    if (spaces.length === 0) {
      return undefined;
    }
    // Oceans have no type-specific primary sort, go straight to tiebreakers.
    return this.selectBestSpace(spaces, () => 0);
  }

  /** Find a space for the Neural Instance tile: not adjacent to any tiles, not on edge, not on/adjacent to reserved spaces. */
  public findNeuralInstanceSpace(): Space | undefined {
    const board = this.game.board;
    const spaces = board.getAvailableSpacesOnLand(this.botPlayer).filter((space) => {
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
      return !adj.some((s) =>
        s.spaceType === SpaceType.OCEAN || s.spaceType === SpaceType.RESTRICTED || s.id === board.noctisCitySpaceId);
    });
    if (spaces.length === 0) {
      return undefined;
    }
    return this.selectBestSpace(spaces, () => 0);
  }

  /**
   * Select the best space from candidates using:
   * 1. primaryScorer (type-specific)
   * 2. The map's tiebreakers, in order (see `MAP_TIEBREAKERS`)
   * 3. Random (using project deck card cost)
   */
  private selectBestSpace(
    spaces: ReadonlyArray<Space>,
    primaryScorer: Scorer,
  ): Space | undefined {
    if (spaces.length === 0) {
      return undefined;
    }
    if (spaces.length === 1) {
      return spaces[0];
    }

    const scorers: ReadonlyArray<Scorer> = [
      primaryScorer,
      ...this.tiebreakerNames().map((name) => this.tiebreaker(name)),
    ];

    // Highest first, each scorer breaking the ties of the ones before it
    const ranking: Comparator<Space> = reversed(compound(...scorers.map((scorer) => comparing(scorer))));
    const sorted = spaces.toSorted(ranking);

    // Find all tied for best. The sort is stable, so they stay in board order for the random tiebreak.
    const tied = sorted.filter((space) => ranking(space, sorted[0]) === 0);

    if (tied.length === 1) {
      return tied[0];
    }

    return this.randomTiebreak(tied);
  }

  /** Scores spaces for one of the map's tiebreakers. */
  private tiebreaker(name: TiebreakerName): Scorer {
    const board = this.game.board;
    switch (name) {
    case 'oceans':
      return (space) => this.adjacentOceans(space);
    case 'icons':
      return (space) => this.iconCount(space);
    case 'polarRegion':
      // The two rows at the bottom of the map.
      return preferring((space) => space.y >= board.bottomRow - 1);
    case 'southernRegion':
      return preferring((space) => space.y > board.equatorRow);
    case 'specialTiles':
      return preferring((space) => board.getAdjacentSpaces(space).some(isSpecialTileSpace));
    case 'edge':
      return preferring((space) => space.edge);
    }
  }

  private adjacentOceans(space: Space): number {
    return this.game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace).length;
  }

  /**
   * How many reward icons `space` counts as when tiebreaking. Without Turmoil the delegate hex
   * counts as empty (rulebook C, p.11).
   */
  private iconCount(space: Space): number {
    return space.bonus.filter((bonus) => bonus !== SpaceBonus.DELEGATE || this.game.turmoil !== undefined).length;
  }

  /**
   * Break a tie by flipping a project card and counting its cost through the tied spaces. Counting
   * starts at 1 on the first space and goes back to the first after passing the last. A cost of 0
   * picks the last space.
   */
  private randomTiebreak(spaces: ReadonlyArray<Space>): Space {
    const card = this.game.projectDeck.drawOrThrow(this.game);
    this.game.projectDeck.discard(card);
    const index = card.cost === 0 ? spaces.length - 1 : (card.cost - 1) % spaces.length;
    return spaces[index];
  }

  /** Calculate MC MarsBot gains from placement bonuses (1 MC per icon covered). */
  public getPlacementBonusMC(space: Space): number {
    return space.bonus.length; // 1 MC per icon
  }

  /** Calculate MC MarsBot gains from ocean adjacency: its player's `oceanBonus` per adjacent ocean. */
  public getOceanAdjacencyMC(space: Space): number {
    const oceans = this.game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace).length;
    return oceans * this.botPlayer.oceanBonus;
  }

  /** Total placement MC for MarsBot: 1 MC per bonus icon + M€ per adjacent ocean. */
  public getTotalPlacementMC(space: Space): number {
    return this.getPlacementBonusMC(space) + this.getOceanAdjacencyMC(space);
  }
}

/**
 * Lists `oceans` just after `icons`, as the Highlander award has it (rulebook C, p.15).
 *
 * A list that already has `oceans` after `icons` stays as it is.
 */
function oceansAfterIcons(names: ReadonlyArray<TiebreakerName>): ReadonlyArray<TiebreakerName> {
  if (names.indexOf('oceans') > names.indexOf('icons')) {
    return names;
  }
  const others = names.filter((name) => name !== 'oceans');
  const afterIcons = others.indexOf('icons') + 1;
  return [...others.slice(0, afterIcons), 'oceans', ...others.slice(afterIcons)];
}

/** Puts the spaces that satisfy `predicate` ahead of the rest. */
function preferring(predicate: (space: Space) => boolean): Scorer {
  return (space) => predicate(space) ? 1 : 0;
}
