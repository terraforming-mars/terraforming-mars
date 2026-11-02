import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Board, isSpecialTileSpace} from '../boards/Board';
import {SpaceType} from '../../common/boards/SpaceType';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardName} from '../../common/boards/BoardName';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';
import {Comparator, comparing, compound, reversed} from '../../common/utils/Ordering';

/**
 * What one tiebreaker compares.
 *
 * The higher score wins.
 */
type Score = (space: Space) => number;
type Scored = {space: Space, scores: ReadonlyArray<number>};
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
 * Spaces that count as one more reward icon when tiebreaking.
 *
 * The icons are still worth 1 M€ each only when they are printed on the space.
 */
type ExtraIcon = 'edge' | 'volcanic' | 'specialTile';
const EXTRA_ICON_SPACES: Record<ExtraIcon, (board: Board, space: Space) => boolean> = {
  edge: (_board, space) => space.edge,
  volcanic: (board, space) => space.volcanic === true || board.getAdjacentSpaces(space).some((s) => s.volcanic === true),
  specialTile: (board, space) => board.getAdjacentSpaces(space).some(isSpecialTileSpace),
};

/** What each map's player aid adds. */
const MAP_EXTRA_ICON: Partial<Record<BoardName, ExtraIcon>> = {
  [BoardName.UTOPIA_PLANITIA]: 'edge',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'volcanic',
};

/**
 * What a milestone or award of the Milestones & Awards expansion adds while it is in play.
 *
 * Where the map above already adds the same, it counts once (rulebook C, pp.13-15).
 */
const MILESTONE_EXTRA_ICON: Partial<Record<MilestoneName, ExtraIcon>> = {
  'Geologist': 'volcanic',
};
const AWARD_EXTRA_ICON: Partial<Record<AwardName, ExtraIcon>> = {
  'Founder': 'specialTile',
  'Suburbian': 'edge',
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
    private readonly marsBot: IPlayer,
    private readonly humanPlayer: IPlayer,
  ) {}

  /**
   * The map whose player aid MarsBot reads its tiebreakers from.
   *
   * The Milestones & Awards expansion plays against the Tharsis board and reference card whatever
   * the map (rulebook C, p.13).
   */
  private mapName(): BoardName {
    const options = this.game.gameOptions;
    return options.modularMA ? BoardName.THARSIS : options.boardName;
  }

  /** The spaces that count as one more reward icon: the map's and those of the milestones and awards in play. */
  private extraIcons(): ReadonlySet<ExtraIcon> {
    const extra = new Set<ExtraIcon>();
    const fromMap = MAP_EXTRA_ICON[this.mapName()];
    if (fromMap !== undefined) {
      extra.add(fromMap);
    }
    for (const milestone of this.game.milestones) {
      const icon = MILESTONE_EXTRA_ICON[milestone.name];
      if (icon !== undefined) {
        extra.add(icon);
      }
    }
    for (const award of this.game.awards) {
      const icon = AWARD_EXTRA_ICON[award.name];
      if (icon !== undefined) {
        extra.add(icon);
      }
    }
    return extra;
  }

  /**
   * The map's tiebreakers, in order.
   *
   * With the Highlander award in play, "adjacent to ocean" comes after the reward icons (rulebook C,
   * p.15).
   */
  private tiebreakerNames(): ReadonlyArray<TiebreakerName> {
    const names = MAP_TIEBREAKERS[this.mapName()] ?? DEFAULT_TIEBREAKERS;
    if (!this.game.awards.some((award) => award.name === 'Highlander')) {
      return names;
    }
    if (names.indexOf('oceans') > names.indexOf('icons')) {
      return names;
    }
    const reordered: Array<TiebreakerName> = names.filter((name) => name !== 'oceans');
    reordered.splice(reordered.indexOf('icons') + 1, 0, 'oceans');
    return reordered;
  }

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
    const spaces = board.getAvailableSpacesForCity(this.marsBot).filter(filter);
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
   * 1. primaryScore function (type-specific)
   * 2. The map's tiebreakers, in order (see `MAP_TIEBREAKERS`)
   * 3. Random (using project deck card cost)
   */
  private selectBestSpace(
    spaces: ReadonlyArray<Space>,
    primaryScore: Score,
  ): Space | undefined {
    if (spaces.length === 0) {
      return undefined;
    }
    if (spaces.length === 1) {
      return spaces[0];
    }

    const extraIcons = this.extraIcons();
    const keys: ReadonlyArray<Score> = [
      primaryScore,
      ...this.tiebreakerNames().map((name) => this.tiebreaker(name, extraIcons)),
    ];
    const scored: Array<Scored> = spaces.map((space) => ({space, scores: keys.map((key) => key(space))}));

    // Highest first, each score breaking the ties of the ones before it
    const ranking: Comparator<Scored> =
      reversed(compound(...keys.map((_, i) => comparing((s: Scored) => s.scores[i]))));
    scored.sort(ranking);

    // Find all tied for best. The sort is stable, so they stay in board order for the random tiebreak.
    const best = scored[0];
    const tied = scored.filter((s) => ranking(s, best) === 0);

    if (tied.length === 1) {
      return tied[0].space;
    }

    return this.randomTiebreak(tied.map((t) => t.space));
  }

  /** The score a map's tiebreaker compares. */
  private tiebreaker(name: TiebreakerName, extraIcons: ReadonlySet<ExtraIcon>): Score {
    const board = this.game.board;
    switch (name) {
    case 'oceans':
      return (space) => this.adjacentOceans(space);
    case 'icons':
      return (space) => this.tiebreakIcons(space, extraIcons);
    case 'polarRegion':
      return preferring((space) => space.y >= board.bottomRow - 1);
    case 'southernRegion':
      return preferring((space) => space.y >= board.bottomRow - 3);
    case 'specialTiles':
      return preferring((space) => board.getAdjacentSpaces(space).some(isSpecialTileSpace));
    case 'edge':
      return preferring((space) => space.edge);
    }
  }

  private adjacentOceans(space: Space): number {
    return this.game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace).length;
  }

  /** The reward icons MarsBot tiebreaks on: those on the space plus the extra ones the map, milestones and awards add. */
  private tiebreakIcons(space: Space, extraIcons: ReadonlySet<ExtraIcon>): number {
    let icons = space.bonus.filter((bonus) => this.countsAsIcon(bonus)).length;
    for (const extra of extraIcons) {
      if (EXTRA_ICON_SPACES[extra](this.game.board, space)) {
        icons++;
      }
    }
    return icons;
  }

  /**
   * Whether `bonus` counts as a reward icon when tiebreaking.
   *
   * Without Turmoil the delegate hex is considered empty (rulebook C, p.11).
   */
  private countsAsIcon(bonus: SpaceBonus): boolean {
    return bonus !== SpaceBonus.DELEGATE || this.game.turmoil !== undefined;
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

/** Puts the spaces that satisfy `wanted` ahead of the rest. */
function preferring(wanted: (space: Space) => boolean): Score {
  return (space) => wanted(space) ? 1 : 0;
}
