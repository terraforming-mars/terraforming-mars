import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {Tag} from '../../common/cards/Tag';
import {toCorpCardRef} from './MarsBotCorpTypes';
import {CardType} from '../../common/cards/CardType';
import {TileType, CITY_TILES, GREENERY_TILES} from '../../common/TileType';
import {Board} from '../boards/Board';
import {
  TrackAction,
  FAILED_ACTION_MC,
  FAILED_ACTION_MC_EASY,
  DifficultyLevel,
} from '../../common/automa/AutomaTypes';
import {MarsBotBoard} from './MarsBotBoard';
import {MarsBotTilePlacer} from './MarsBotTilePlacer';
import {IMilestone} from '../milestones/IMilestone';
import {IAward} from '../awards/IAward';
import {Resource} from '../../common/Resource';
import * as constants from '../../common/constants';
import {MarsBotCorpResolver} from './corps/MarsBotCorpResolver';
import {MILESTONE_EVALS, AWARD_EVALS, MarsBotMAContext} from './MarsBotMilestoneAwardEval';
import type {MarsBot} from './MarsBot';

/**
 * Resolves MarsBot turns: flips cards from the action deck, advances tracks,
 * and performs track actions.
 */
export class MarsBotTurnResolver {
  public readonly tilePlacer: MarsBotTilePlacer;

  /** Reference to the MarsBot manager (set after construction for corp cube triggers). */
  public marsBotManager: MarsBot | undefined;

  constructor(
    private readonly game: IGame,
    private readonly marsBot: IPlayer,
    private readonly humanPlayer: IPlayer,
    public readonly board: MarsBotBoard,
    private readonly difficulty: DifficultyLevel,
    public mcSupply: number = 0,
    tilePlacer?: MarsBotTilePlacer,
  ) {
    this.tilePlacer = tilePlacer ?? new MarsBotTilePlacer(game, marsBot, humanPlayer);
  }

  // ---- Project Card Resolution ----

  /** Resolve a project card: advance tracks based on tags. */
  public resolveProjectCard(card: IProjectCard): void {
    this.game.log('MarsBot plays ${0}', (b) => b.card(card));

    // Build the effective tag list: card.tags + Event tag if the card is an event type.
    // In the physical game, event cards show the Event tag icon on the top-right.
    // In the codebase, card.tags does NOT include Tag.EVENT for event-type cards.
    const tags: Array<Tag> = [...card.tags];
    if (card.type === CardType.EVENT && !tags.includes(Tag.EVENT)) {
      tags.push(Tag.EVENT);
    }

    if (tags.length === 0) {
      this.game.log('MarsBot takes a Failed Action (card has no tags)');
      this.failedAction();
      return;
    }

    // Resolve each tag left-to-right
    let advancedAny = false;
    for (const tag of tags) {
      if (tag === Tag.WILD) {
        // Prelude rule: advance the least-advanced track, topmost if tied
        const leastIndex = this.board.getLeastAdvancedTrackIndex();
        this.game.log('MarsBot: wild tag advances least-advanced track ${0}', (b) => b.number(leastIndex + 1));
        this.advanceTrack(leastIndex);
        advancedAny = true;
        continue;
      }

      const trackIndex = this.board.getTrackIndexForTag(tag);
      if (trackIndex === undefined) {
        this.game.log('MarsBot: tag ${0} has no matching track, ignored', (b) => b.rawString(tag));
        continue;
      }

      this.advanceTrack(trackIndex);
      advancedAny = true;
    }
    if (!advancedAny && tags.length > 0) {
      this.game.log('MarsBot: no tracks advanced');
    }

    // Notify corp of card resolution
    this.marsBotManager?.corp?.effect?.onProjectCardResolved?.(
      this.marsBotManager.getCorpContext(),
      toCorpCardRef(card.name, card.tags, card.cost, card.requirements !== undefined, card.getVictoryPoints(this.marsBot)),
    );

    // Notify human player's effect cards (Solar Logistics, Saturn Systems, etc.)
    for (const effectCard of this.humanPlayer.playedCards) {
      this.humanPlayer.defer(effectCard.onCardPlayedByAnyPlayer?.(this.humanPlayer, card, this.marsBot));
    }

    // Card goes to MarsBot's played pile (for Hard mode scoring)
    this.game.projectDeck.discardPile.push(card);
  }

  // ---- Track Advancement ----

  private trackName(trackIndex: number): string {
    return this.board.tracks[trackIndex]?.definition.tags[0] ?? `Track ${trackIndex}`;
  }

  /** Advance a track by index. Handles chain actions. */
  public advanceTrack(trackIndex: number): void {
    const track = this.board.tracks[trackIndex];
    const name = this.trackName(trackIndex);

    const result = track.advance();

    if (result.type === 'maxed') {
      this.game.log('MarsBot: ${0} track at max, Failed Action', (b) => b.rawString(name));
      this.failedAction();
      return;
    }

    // Corp cube trigger — fires BEFORE track icon resolution
    if (this.marsBotManager?.corp !== undefined) {
      MarsBotCorpResolver.onTrackAdvanced(this.marsBotManager, trackIndex, track.position);
    }

    if (result.type === 'action') {
      this.game.log('MarsBot: ${0} track to ${1}, action: ${2}',
        (b) => b.rawString(name).number(track.position).rawString(result.action));
      this.resolveTrackAction(result.action, trackIndex);
    } else {
      this.game.log('MarsBot: ${0} track to ${1}',
        (b) => b.rawString(name).number(track.position));
    }
  }

  /** Resolve an action icon on a track position. */
  private resolveTrackAction(action: TrackAction, currentTrackIndex: number): void {
    // Parse TR value
    const trMatch = action.match(/^tr(\d+)$/);
    if (trMatch) {
      const amount = parseInt(trMatch[1], 10);
      this.marsBot.increaseTerraformRating(amount);
      this.game.log('MarsBot gains ${0} TR', (b) => b.number(amount));
      return;
    }

    // Parse tag_N (advance another track)
    const tagMatch = action.match(/^tag_(\d+)$/);
    if (tagMatch) {
      const targetTrack = parseInt(tagMatch[1], 10);
      this.advanceTrack(targetTrack);
      return;
    }

    switch (action) {
    case 'advance':
      if (this.difficulty === 'easy') return; // Easy mode ignores advance actions
      this.advanceTrack(currentTrackIndex);
      return;

    case 'milestone':
      this.tryClaimMilestone();
      return;

    case 'award':
      this.tryFundAward();
      return;

    case 'temperature':
      this.raiseTemperature(1);
      return;

    case 'temperature2':
      this.raiseTemperature(2);
      return;

    case 'greenery':
      this.placeGreenery();
      return;

    case 'ocean':
      this.placeOcean();
      return;

    case 'city':
      this.placeCity();
      return;

    case 'venus':
      if (!this.game.gameOptions.venusNextExtension) return; // Ignore if expansion not in use
      this.raiseVenus(1);
      return;

    case 'venus2':
      if (!this.game.gameOptions.venusNextExtension) return;
      this.raiseVenus(2);
      return;
    }
  }

  // ---- Terraforming Actions ----

  private raiseTemperature(steps: number): void {
    if (this.game.getTemperature() >= constants.MAX_TEMPERATURE) {
      this.failedAction();
      return;
    }
    const increment = steps as 1 | 2;
    this.game.increaseTemperature(this.marsBot, increment);
    if (this.marsBotManager) this.marsBotManager.temperatureRaises += steps;
    this.game.log('MarsBot raises temperature ${0} step(s)', (b) => b.number(steps));
    // Temperature bonuses at -24C and -20C: MarsBot gains 2 MC instead of heat production
    // This is handled by the game engine granting heat production; we override in MarsBot's production
    // Since MarsBot doesn't use production, we grant 2 MC for each heat bonus step hit.
  }

  public placeGreenery(): void {
    const space = this.tilePlacer.findGreenerySpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    // Place tile and raise oxygen
    this.game.addGreenery(this.marsBot, space, true);

    // MarsBot placement bonuses: 1 MC per icon, 2 MC per adjacent ocean
    this.mcSupply += this.tilePlacer.getTotalPlacementMC(space);
    this.game.log('MarsBot places greenery');
  }

  public placeOcean(): void {
    if (!this.game.canAddOcean()) {
      this.failedAction();
      return;
    }
    const space = this.tilePlacer.findOceanSpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    this.game.addOcean(this.marsBot, space);

    // MarsBot placement bonuses
    this.mcSupply += this.tilePlacer.getTotalPlacementMC(space);
    this.game.log('MarsBot places ocean');
  }

  public placeCity(): void {
    const space = this.tilePlacer.findCitySpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    this.game.addCity(this.marsBot, space);

    // MarsBot placement bonuses
    this.mcSupply += this.tilePlacer.getTotalPlacementMC(space);
    this.game.log('MarsBot places city');
  }

  private raiseVenus(steps: number): void {
    if (this.game.getVenusScaleLevel() >= constants.MAX_VENUS_SCALE) {
      this.failedAction();
      return;
    }
    this.game.increaseVenusScaleLevel(this.marsBot, steps as 1 | 2);
    this.game.log('MarsBot raises Venus ${0} step(s)', (b) => b.number(steps));
  }

  // ---- Milestones & Awards ----

  private tryClaimMilestone(): void {
    const claimable = this.getClaimableMilestones();
    if (claimable.length === 0) {
      this.failedAction();
      return;
    }

    // Tiebreakers: 1) one human also qualifies for, 2) one human is closest to, 3) leftmost
    let best = claimable[0]; // Default: leftmost (first in array)

    // Tiebreaker 1: prefer milestones the human also qualifies for
    const humanAlsoQualifies = claimable.filter((m) => m.canClaim(this.humanPlayer));
    if (humanAlsoQualifies.length > 0) {
      best = humanAlsoQualifies[0];
    } else {
      // Tiebreaker 2: whichever the human is closest to meeting
      // Score each milestone by how close the human is (higher = closer)
      let bestCloseness = -Infinity;
      for (const m of claimable) {
        const closeness = this.humanMilestoneCloseness(m);
        if (closeness > bestCloseness) {
          bestCloseness = closeness;
          best = m;
        }
      }
    }

    this.game.claimedMilestones.push({player: this.marsBot, milestone: best});
    this.game.log('MarsBot claims milestone ${0}', (b) => b.rawString(best.name));

    // Briber milestone: lose 12 MC on claim
    if (best.name === 'Briber') {
      this.mcSupply = Math.max(0, this.mcSupply - 12);
      this.game.log('MarsBot loses 12 MC (Briber)');
    }
  }

  private getClaimableMilestones(): Array<IMilestone> {
    if (this.game.allMilestonesClaimed()) return [];
    return this.game.milestones.filter((m) => {
      if (this.game.milestoneClaimed(m)) return false;
      return this.marsBotMeetsMilestone(m);
    });
  }

  /** Estimate how close the human player is to meeting a milestone (higher = closer). */
  private humanMilestoneCloseness(milestone: IMilestone): number {
    const name = milestone.name;
    switch (name) {
    case 'Terraformer': return this.humanPlayer.getTerraformRating(); // closer to 35
    case 'Mayor': return this.game.board.getCities(this.humanPlayer).length;
    case 'Gardener': return this.game.board.getGreeneries(this.humanPlayer).length;
    case 'Builder': return this.humanPlayer.tags.count(Tag.BUILDING, 'raw'); // closer to 8
    case 'Planner': return this.humanPlayer.cardsInHand.length + this.humanPlayer.playedCards.length; // closer to 16
    default: return 0;
    }
  }

  /** Check if MarsBot meets a milestone using track-based criteria. */
  public marsBotMeetsMilestone(milestone: IMilestone): boolean {
    const evalFn = MILESTONE_EVALS.get(milestone.name);
    if (evalFn !== undefined) {
      const result = evalFn(this.buildMAContext());
      if (result !== undefined) return result;
    }
    return milestone.canClaim(this.marsBot);
  }

  private tryFundAward(): void {
    if (this.game.allAwardsFunded()) {
      this.failedAction();
      return;
    }

    const unfunded = this.game.awards.filter((a) => !this.game.hasBeenFunded(a));
    // Find the award where MarsBot is most ahead of the human
    let bestAward: IAward | undefined;
    let bestMargin = -Infinity;

    for (const award of unfunded) {
      const marsBotValue = this.getMarsBotAwardValue(award);
      // Per rules (page 8): "MarsBot considers your current number of resources plus your production"
      const humanValue = this.getHumanAwardValueForComparison(award);
      const margin = marsBotValue - humanValue;
      if (margin > bestMargin) {
        bestMargin = margin;
        bestAward = award;
      }
    }

    if (bestAward === undefined || bestMargin <= 0) {
      // MarsBot is not ahead on any award
      this.failedAction();
      return;
    }

    this.game.fundAward(this.marsBot, bestAward);
    this.game.log('MarsBot funds award ${0}', (b) => b.rawString(bestAward.name));
  }

  /** Get MarsBot's value for an award using track-based evaluation. */
  public getMarsBotAwardValue(award: IAward): number {
    const offset = this.difficulty === 'easy' ? -5 : 0;
    const evalFn = AWARD_EVALS.get(award.name);
    if (evalFn !== undefined) {
      const result = evalFn(this.buildMAContext());
      if (result !== undefined) return result + offset;
    }
    return award.getScore(this.marsBot) + offset;
  }

  /**
   * Per rules page 8: "MarsBot considers your current number of resources plus your production"
   * for resource-based awards like Thermalist (heat) and Miner (steel+titanium).
   */
  private getHumanAwardValueForComparison(award: IAward): number {
    const name = award.name;
    switch (name) {
    case 'Thermalist':
      return this.humanPlayer.heat + this.humanPlayer.production.get(Resource.HEAT);
    case 'Miner':
      return this.humanPlayer.steel + this.humanPlayer.titanium +
        this.humanPlayer.production.get(Resource.STEEL) + this.humanPlayer.production.get(Resource.TITANIUM);
    default:
      return award.getScore(this.humanPlayer);
    }
  }

  // ---- MA Context ----

  private buildMAContext(): MarsBotMAContext {
    const tracks = this.board.tracks;
    const positions = tracks.map((t) => t.position);
    const playedCards = this.marsBotManager?.playedProjectCards ?? [];

    const cityCount = this.countMarsBotTiles(TileType.CITY);
    const greeneryCount = this.countMarsBotTiles(TileType.GREENERY);
    const tilesOwned = this.countMarsBotTiles();

    const ownedSpaces = this.game.board.spaces.filter(Board.ownedBy(this.marsBot));
    const oceanSpaces = this.game.board.getOceanSpaces();
    const oceanIds = new Set(oceanSpaces.map((s) => s.id));

    let tilesAdjacentToOcean = 0;
    let tilesNotAdjacentToOcean = 0;
    let tilesOnEdge = 0;
    for (const space of ownedSpaces) {
      const adj = this.game.board.getAdjacentSpaces(space);
      if (adj.some((a) => oceanIds.has(a.id))) {
        tilesAdjacentToOcean++;
      } else {
        tilesNotAdjacentToOcean++;
      }
      if (adj.length < 6) tilesOnEdge++;
    }

    let greenCards = 0;
    let blueCards = 0;
    let redCards = 0;
    let withoutTags = 0;
    let costing20Plus = 0;
    let costing10OrLess = 0;
    let withNonNegativeVP = 0;
    let withRequirements = 0;
    for (const card of playedCards) {
      if (card.type === CardType.EVENT) redCards++;
      else if (card.type === CardType.ACTIVE) blueCards++;
      else greenCards++;
      if (card.tags.length === 0) withoutTags++;
      if (card.cost >= 20) costing20Plus++;
      if (card.cost <= 10) costing10OrLess++;
      if (card.getVictoryPoints(this.marsBot) >= 0) withNonNegativeVP++;
      if (card.requirements !== undefined) withRequirements++;
    }

    return {
      trackPos: (index: number) => tracks[index]?.position ?? 0,
      allTrackPositions: () => positions,
      tr: this.marsBot.getTerraformRating(),
      mc: this.mcSupply,
      cityCount,
      greeneryCount,
      oceanCount: this.game.board.getOceanSpaces().filter((s) => s.player === this.marsBot).length,
      tilesOwned,
      tilesAdjacentToOcean,
      tilesOnEdge,
      tilesNotAdjacentToOcean,
      playedCards: {
        total: playedCards.length,
        green: greenCards,
        blue: blueCards,
        red: redCards,
        greenOrBlue: greenCards + blueCards,
        withoutTags,
        costing20Plus,
        costing10OrLess,
        withNonNegativeVP,
        withRequirements,
      },
      destroyedBonusCards: this.marsBotManager?.bonusDeck.drawPile.filter((c) => c.destroyed).length ?? 0,
      temperatureRaises: this.marsBotManager?.temperatureRaises ?? 0,
      highestTrackPos: Math.max(...positions),
      lowestTrackPos: Math.min(...positions),
      tracksAtOrAbove: (pos: number) => positions.filter((p) => p >= pos).length,
      largestConnectedTileGroup: this.calcLargestConnectedTileGroup(),
      specialTilesOwned: this.marsBotManager?.neuralInstanceSpace !== undefined ? 1 : 0,
      hasVenus: false, // Venus not yet implemented
      venusTrackPos: 0,
    };
  }

  // ---- Utilities ----

  private failedAction(): void {
    const mc = this.difficulty === 'easy' ? FAILED_ACTION_MC_EASY : FAILED_ACTION_MC;
    this.mcSupply += mc;
    this.game.log('MarsBot takes a Failed Action, gains ${0} MC', (b) => b.number(mc));
  }

  private calcLargestConnectedTileGroup(): number {
    const ownedSpaces = this.game.board.spaces.filter(Board.ownedBy(this.marsBot));
    if (ownedSpaces.length === 0) return 0;
    const visited = new Set<string>();
    let largest = 0;
    for (const space of ownedSpaces) {
      if (visited.has(space.id)) continue;
      let groupSize = 0;
      const queue = [space];
      while (queue.length > 0) {
        const s = queue.pop();
        if (s === undefined) break;
        if (visited.has(s.id)) continue;
        visited.add(s.id);
        groupSize++;
        for (const adj of this.game.board.getAdjacentSpaces(s)) {
          if (!visited.has(adj.id) && adj.player === this.marsBot) {
            queue.push(adj);
          }
        }
      }
      if (groupSize > largest) largest = groupSize;
    }
    return largest;
  }

  private countMarsBotTiles(tileType?: TileType): number {
    if (tileType !== undefined && CITY_TILES.has(tileType)) {
      return this.game.board.getCities(this.marsBot).length;
    }
    if (tileType !== undefined && GREENERY_TILES.has(tileType)) {
      return this.game.board.getGreeneries(this.marsBot).length;
    }
    if (tileType === undefined) {
      return this.game.board.spaces.filter(Board.ownedBy(this.marsBot)).length;
    }
    return this.game.board.spaces.filter((s) =>
      s.player === this.marsBot && s.tile?.tileType === tileType,
    ).length;
  }
}
