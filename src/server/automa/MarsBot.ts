import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {IProjectCard} from '../cards/IProjectCard';
import {Resource} from '../../common/Resource';
import {CardName} from '../../common/cards/CardName';
import {DifficultyLevel, BonusCardId, TrackDefinition, getAutomaMaxGeneration} from '../../common/automa/AutomaTypes';
import {getMcPerVP} from './MarsBotScoring';
import {MarsBotBoard} from './MarsBotBoard';
import {MarsBotModel} from '../../common/models/MarsBotModel';
import {MarsBotBonusCard, createCorpBonusCard} from './MarsBotBonusCard';
import {MarsBotBonusDeck} from './MarsBotBonusDeck';
import {MarsBotBonusResolver} from './MarsBotBonusResolver';
import {MarsBotTilePlacer} from './MarsBotTilePlacer';
import {MarsBotTurnResolver} from './MarsBotTurnResolver';
import {MarsBotScoring, MarsBotVPBreakdown} from './MarsBotScoring';
import {Space} from '../boards/Space';
import {Random} from '../../common/utils/Random';
import {inplaceShuffle} from '../utils/shuffle';
import {IMarsBotCorp, MarsBotTrackCube, MarsBotCorpContext, trackCubeKey} from './MarsBotCorpTypes';
import {MarsBotCorpResolver} from './corps/MarsBotCorpResolver';
import {getMarsBotCorp} from './corps/MarsBotCorpRegistry';
import {SerializedAutomaState} from '../SerializedGame';

/**
 * MarsBot: the automa manager. Owns the board, decks, and coordinates turns.
 *
 * This is NOT a Player subclass — MarsBot uses a real Player instance for
 * game engine compatibility (tile ownership, TR tracking) but drives it
 * externally via this manager.
 */
export class MarsBot {
  public readonly board: MarsBotBoard;
  public readonly bonusDeck: MarsBotBonusDeck;
  public readonly turnResolver: MarsBotTurnResolver;
  private readonly bonusResolver: MarsBotBonusResolver;
  private readonly tilePlacer: MarsBotTilePlacer;

  /** The current generation's action deck (project cards + optional bonus card). */
  public actionDeck: Array<IProjectCard | MarsBotBonusCard> = [];

  /** Space where the Neural Instance tile was placed (if any). */
  public neuralInstanceSpace: Space | undefined;

  /** Whether MarsBot goes first this generation (alternates each gen, human first in gen 1). */
  public goesFirst: boolean = false;

  /** Cards MarsBot has played (for Hard mode VP scoring). */
  public playedProjectCards: Array<IProjectCard> = [];

  /** Corporation card (Rulebook B). */
  public corp: IMarsBotCorp | undefined;

  /** Track cube positions placed by the corporation. Key: "trackIndex:position". */
  public trackCubePositions: Map<string, MarsBotTrackCube> = new Map();

  /** Cube positions that have already been triggered (won't re-trigger after regression). */
  public triggeredCubePositions: Set<string> = new Set();

  /** VP total per generation (for end-game chart). */
  public vpByGeneration: Array<number> = [];

  /** Number of times MarsBot raised temperature (for Thawer milestone). */
  public temperatureRaises: number = 0;

  /** Whether colony cubes are placed (Pioneer4/Constructor in game). */
  public hasColonyCubes: boolean = false;

  /** Corp-specific state (M€ on card, resources, cubes, etc.). */
  public corpSpecificState: Map<string, number> = new Map();

  /** Cached corp context (reused across calls within the same game). */
  private cachedCorpContext: MarsBotCorpContext | undefined;

  /** Floater resources (Venus Next corps). */
  public floaterCount: number = 0;

  constructor(
    public readonly game: IGame,
    /** The Player instance that represents MarsBot in the game engine. */
    public readonly player: IPlayer,
    /** The human opponent. */
    public readonly humanPlayer: IPlayer,
    boardData: ReadonlyArray<TrackDefinition>,
    public readonly difficulty: DifficultyLevel,
    private readonly random: Random,
  ) {
    this.board = new MarsBotBoard(boardData);
    this.bonusDeck = MarsBotBonusDeck.createBase(random);
    this.tilePlacer = new MarsBotTilePlacer(game, player, humanPlayer);
    this.turnResolver = new MarsBotTurnResolver(
      game, player, humanPlayer, this.board, difficulty, 0, this.tilePlacer,
    );
    this.bonusResolver = new MarsBotBonusResolver(
      game, player, humanPlayer, this.turnResolver, this.bonusDeck, this.tilePlacer,
    );
    this.bonusResolver.onNeuralInstancePlaced = (space) => {
      this.neuralInstanceSpace = space;
    };
  }

  // ---- Setup ----

  /** Build MarsBot's initial action deck: 3 project cards + 1 bonus card (+ 3 extra with Prelude). */
  public buildInitialActionDeck(): void {
    const opts = this.game.gameOptions;
    // Prelude: MarsBot gets 3 extra project cards instead of Prelude cards
    const numProjectCards = opts.preludeExtension ? 6 : 3;
    const projectCards = this.game.projectDeck.drawN(this.game, numProjectCards);
    const bonusCard = this.bonusDeck.draw();
    const deck: Array<IProjectCard | MarsBotBonusCard> = [...projectCards];
    if (bonusCard) {
      deck.push(bonusCard);
    }
    inplaceShuffle(deck, this.random);
    this.actionDeck = deck;
  }

  // ---- Research Phase ----

  /** Build MarsBot's action deck for a new generation (non-drafting). */
  public buildResearchActionDeck(): void {
    const numProjectCards = this.difficulty === 'brutal' ? 4 : 3;
    const projectCards = this.game.projectDeck.drawN(this.game, numProjectCards);
    const bonusCard = this.bonusDeck.draw();

    const deck: Array<IProjectCard | MarsBotBonusCard> = [...projectCards];
    if (bonusCard !== undefined) {
      deck.push(bonusCard);
    }

    inplaceShuffle(deck, this.random);
    this.actionDeck = deck;

    this.game.log('MarsBot builds action deck with ${0} cards', (b) => b.number(this.actionDeck.length));
  }

  /** Build MarsBot's action deck from drafted cards (drafting variant). */
  public buildResearchActionDeckFromDraft(draftedCards: Array<IProjectCard>): void {
    // Shuffle drafted cards, discard 1 to project discard
    inplaceShuffle(draftedCards, this.random);
    const discarded = draftedCards.pop();
    if (discarded) {
      this.game.projectDeck.discardPile.push(discarded);
    }

    // Add 1 bonus card
    const bonusCard = this.bonusDeck.draw();
    const deck: Array<IProjectCard | MarsBotBonusCard> = [...draftedCards];
    if (bonusCard !== undefined) {
      deck.push(bonusCard);
    }

    inplaceShuffle(deck, this.random);
    this.actionDeck = deck;
    this.game.log('MarsBot builds action deck from draft with ${0} cards', (b) => b.number(this.actionDeck.length));
  }

  // ---- Action Phase ----

  /** Execute one MarsBot action (called when it's MarsBot's turn). */
  public takeTurn(): void {
    if (this.actionDeck.length === 0) {
      this.game.playerHasPassed(this.player);
      this.game.log('MarsBot passed');
      this.game.playerIsFinishedTakingActions();
      return;
    }

    const card = this.actionDeck.shift();
    if (card === undefined) return;

    if (this.isProjectCard(card)) {
      const projectCard = card as IProjectCard;
      this.playedProjectCards.push(projectCard);
      this.turnResolver.resolveProjectCard(projectCard);
    } else {
      const bonusCard = card as MarsBotBonusCard;
      this.game.log('MarsBot plays bonus card: ${0}', (b) => b.rawString(bonusCard.name));
      this.bonusResolver.resolve(bonusCard);
    }

    // Hard mode: first turn milestone check
    if (this.difficulty === 'hard' || this.difficulty === 'brutal') {
      this.hardModeFirstTurnMilestone();
    }

    // Signal that MarsBot's turn is done
    this.game.playerIsFinishedTakingActions();
  }

  /** Hard mode: on first turn of each gen, if 8 MC and meets milestone conditions, claim.
   * MarsBot starts at 0 MC and accumulates from failed actions (5 MC each) and placement bonuses. */
  private hardModeFirstTurnMilestone(): void {
    if (this.player.actionsTakenThisRound !== 0) {
      return;
    }
    if (this.turnResolver.mcSupply < 8) {
      return;
    }
    if (this.game.allMilestonesClaimed()) {
      return;
    }

    const unclaimed = this.game.milestones.filter((m) => !this.game.milestoneClaimed(m));
    const claimedCount = this.game.claimedMilestones.length;
    const canClaimCount = unclaimed.filter((m) => this.turnResolver.marsBotMeetsMilestone(m)).length;

    // MarsBot claims when it can fill all 3 milestone slots (needs 3 - claimedCount eligible).
    const shouldClaim = claimedCount < 3 && claimedCount + canClaimCount >= 3;

    if (shouldClaim) {
      const toClaim = unclaimed.find((m) => this.turnResolver.marsBotMeetsMilestone(m));
      if (toClaim) {
        this.game.claimedMilestones.push({player: this.player, milestone: toClaim});
        this.turnResolver.mcSupply -= 8;
        this.game.log('MarsBot claims milestone ${0} (Hard mode), loses 8 MC', (b) => b.rawString(toClaim.name));
      }
    }
  }

  /** Production phase: MarsBot skips production entirely. */
  public runProductionPhase(): void {
    // MarsBot does not produce. Just reset per-generation state.
    this.player.actionsThisGeneration.clear();
  }

  // ---- Final Greenery ----

  /** Place final greenery tiles for MarsBot (tracks with greenery as next action). */
  public placeFinalGreeneries(): void {
    for (const track of this.board.tracks) {
      const nextAction = track.peek();
      if (nextAction === 'greenery') {
        const space = this.tilePlacer.findGreenerySpace();
        if (space) {
          // Do NOT raise oxygen or award TR for final greenery
          this.game.addGreenery(this.player, space, false);
          track.advance(); // Move tracker forward
          this.game.log('MarsBot places final greenery (${0} track)', (b) => b.rawString(track.definition.tags[0]));
        }
      }
    }
  }

  // ---- Corporation ----

  /** Set the corporation and run its setup. */
  public setCorpAndSetup(corp: IMarsBotCorp): void {
    this.corp = corp;
    MarsBotCorpResolver.setupCorp(corp, this);
    this.game.log('MarsBot selects corporation: ${0}', (b) => b.rawString(corp.name));
  }

  /** Build the context object for corp callbacks. Cached for reuse since all dynamic fields are getters. */
  public getCorpContext(): MarsBotCorpContext {
    if (this.cachedCorpContext !== undefined) return this.cachedCorpContext;
    const mb = this;
    this.cachedCorpContext = {
      gameLog: (msg: string) => mb.game.log(msg),
      advanceTrack: (trackIndex: number) => mb.turnResolver.advanceTrack(trackIndex),
      get mcSupply() { return mb.turnResolver.mcSupply; },
      setMcSupply: (mc: number) => { mb.turnResolver.mcSupply = mc; },
      get trackPositions() { return mb.board.tracks.map((t) => t.position); },
      get humanPlayerTR() { return mb.humanPlayer.getTerraformRating(); },
      get marsBotTR() { return mb.player.getTerraformRating(); },
      get generation() { return mb.game.generation; },
      get leastAdvancedTrackIndex() { return mb.board.getLeastAdvancedTrackIndex(); },
      get mostAdvancedTrackIndex() { return mb.board.getMostAdvancedTrackIndex(); },
      drawAndResolveProjectCard: () => {
        const cards = mb.game.projectDeck.drawN(mb.game, 1);
        if (cards.length === 0) return false;
        mb.turnResolver.resolveProjectCard(cards[0]);
        return true;
      },
      drawAndResolveProjectCardIgnoringFirstNTags: (n: number) => {
        const cards = mb.game.projectDeck.drawN(mb.game, 1);
        if (cards.length === 0) return false;
        const card = cards[0];
        // Use Object.create to preserve prototype (methods like getVictoryPoints)
        const mockCard = Object.create(card, {tags: {value: card.tags.slice(n)}}) as IProjectCard;
        mb.turnResolver.resolveProjectCard(mockCard);
        return true;
      },
      drawAndResolveBonusCard: () => {
        const bonusCard = mb.bonusDeck.draw();
        if (bonusCard === undefined) return false;
        mb.bonusResolver.resolve(bonusCard);
        return true;
      },
      raiseTemperature: (steps: 1 | 2 | 3) => {
        mb.game.increaseTemperature(mb.player, steps);
      },
      placeOcean: () => {
        mb.turnResolver.placeOcean();
      },
      placeCity: () => {
        mb.turnResolver.placeCity();
      },
      placeGreenery: () => {
        mb.turnResolver.placeGreenery();
      },
      addProjectCardToActionDeck: (count: number) => {
        const cards = mb.game.projectDeck.drawN(mb.game, count);
        mb.actionDeck.push(...cards);
      },
      addBonusCardToActionDeck: (bonusCardId: string) => {
        // Try to find existing card in deck first, otherwise create a new one
        let card = mb.bonusDeck.findAndRemove(bonusCardId);
        if (card === undefined) {
          card = createCorpBonusCard(bonusCardId as BonusCardId);
        }
        mb.actionDeck.push(card);
      },
      removeBonusCardFromDeck: (bonusCardId: string) => {
        mb.bonusDeck.removeById(bonusCardId);
      },
      addBonusCardToBonusDeck: (bonusCardId: string) => {
        const card = createCorpBonusCard(bonusCardId as BonusCardId);
        mb.bonusDeck.drawPile.push(card);
      },
      getCorpState: (key: string) => mb.corpSpecificState.get(key) ?? 0,
      setCorpState: (key: string, value: number) => { mb.corpSpecificState.set(key, value); },
      raiseTR: (steps: number) => {
        if (steps > 0) {
          mb.player.increaseTerraformRating(steps);
        } else if (steps < 0) {
          mb.player.decreaseTerraformRating(-steps);
        }
      },
      get floaterCount() { return mb.floaterCount; },
      addFloaters: (count: number) => { mb.floaterCount += count; },
      spendFloaters: (count: number) => { mb.floaterCount = Math.max(0, mb.floaterCount - count); },
      gainMc: (amount: number) => { mb.turnResolver.mcSupply += amount; },
      discardFewestTagsFromActionDeck: () => {
        if (mb.actionDeck.length === 0) return;
        let fewestTags = Infinity;
        let fewestIdx = 0;
        for (let i = 0; i < mb.actionDeck.length; i++) {
          const card = mb.actionDeck[i];
          const tagCount = mb.isProjectCard(card) ? (card as IProjectCard).tags.length : 0;
          if (tagCount < fewestTags) {
            fewestTags = tagCount;
            fewestIdx = i;
          }
        }
        const discarded = mb.actionDeck.splice(fewestIdx, 1)[0];
        if (mb.isProjectCard(discarded)) {
          mb.game.projectDeck.discardPile.push(discarded as IProjectCard);
        }
        mb.game.log('MarsBot (Polyphemos): discarded card with fewest tags from action deck');
      },
    };
    return this.cachedCorpContext;
  }

  /** Check if a cube exists at a given track position. */
  public hasCubeAt(trackIndex: number, position: number): MarsBotTrackCube | undefined {
    return this.trackCubePositions.get(trackCubeKey(trackIndex, position));
  }

  /** Check if a cube at this position has already been triggered. */
  public isCubeTriggered(trackIndex: number, position: number): boolean {
    return this.triggeredCubePositions.has(trackCubeKey(trackIndex, position));
  }

  /** Mark a cube position as triggered. */
  public markCubeTriggered(trackIndex: number, position: number): void {
    this.triggeredCubePositions.add(trackCubeKey(trackIndex, position));
  }

  // ---- Scoring ----

  /** Calculate MarsBot's final VP. */
  public getVictoryPoints(): MarsBotVPBreakdown {
    const corpVpBonus = this.corp?.effect?.vpBonus?.(this.getCorpContext()) ?? 0;
    const scoring = new MarsBotScoring(
      this.game, this.player, this.humanPlayer,
      this.turnResolver, this.difficulty, this.neuralInstanceSpace,
      this.playedProjectCards, corpVpBonus,
    );
    return scoring.calculate();
  }

  /** Check if MarsBot instantly wins (gen 20, or gen 18 with Prelude). */
  public isInstantWin(): boolean {
    const opts = this.game.gameOptions;
    return this.game.generation >= getAutomaMaxGeneration(opts.preludeExtension);
  }

  // ---- Track Regression (human effects) ----

  /** Regress a track when human decreases MarsBot's production. */
  public regressTrack(productionType: Resource): void {
    for (let i = 0; i < this.board.tracks.length; i++) {
      const trackDef = this.board.data[i];
      if (trackDef.productions.includes(productionType)) {
        this.board.tracks[i].regress();
        this.game.log('MarsBot\'s ${0} track regressed (${1} production decreased)',
          (b) => b.rawString(trackDef.tags[0]).rawString(productionType));
        return;
      }
    }
  }

  // ---- Client Model ----

  /** Build the model sent to the client for display. */
  public toModel(): MarsBotModel {
    const vp = this.getVictoryPoints();
    const model: MarsBotModel = {
      name: this.player.name,
      color: this.player.color,
      difficulty: this.difficulty,
      tracks: this.board.tracks.map((track) => ({
        tags: track.definition.tags,
        position: track.position,
        layout: track.definition.layout,
      })),
      terraformRating: this.player.getTerraformRating(),
      mcSupply: this.turnResolver.mcSupply,
      actionDeckSize: this.actionDeck.length,
      bonusDeckSize: this.bonusDeck.drawPile.length,
      vpBreakdown: vp,
      instantWin: this.isInstantWin(),
    };
    if (this.corp !== undefined) {
      model.corpName = this.corp.name as CardName;
      model.corpDescription = this.corp.description;
      model.trackCubes = Array.from(this.trackCubePositions.values()).map((c) => ({
        trackIndex: c.trackIndex - 1, position: c.position, cubeType: c.cubeType,
      }));
    }
    const opts = this.game.gameOptions;
    const mcPerVP = getMcPerVP(this.game.generation, opts.preludeExtension);
    if (mcPerVP !== undefined) {
      model.mcPerVP = mcPerVP;
      model.mcVP = Math.floor(this.turnResolver.mcSupply / mcPerVP);
    }
    model.globalParameterSteps = this.player.globalParameterSteps;
    model.vpByGeneration = this.vpByGeneration;
    return model;
  }

  // ---- Serialization ----

  public serialize(): SerializedAutomaState {
    const state: SerializedAutomaState = {
      trackPositions: this.board.tracks.map((t) => t.position),
      trackRegressedPositions: this.board.tracks.map((t) => Array.from(t.regressedPositions)),
      mcSupply: this.turnResolver.mcSupply,
      goesFirst: this.goesFirst,
      difficulty: this.difficulty,
      actionDeckCardNames: this.actionDeck.map((c) => this.isProjectCard(c) ? c.name : (c as MarsBotBonusCard).id),
      bonusDeckDrawPile: this.bonusDeck.drawPile.map((c) => c.id),
      bonusDeckDiscardPile: this.bonusDeck.discardPile.map((c) => c.id),
      destroyedBonusCards: this.bonusDeck.drawPile.concat(this.bonusDeck.discardPile)
        .filter((c) => c.destroyed).map((c) => c.id),
      neuralInstanceSpaceId: this.neuralInstanceSpace?.id,
      playedProjectCardNames: this.playedProjectCards.map((c) => c.name),
      marsBotPlayerId: this.player.id,
    };
    if (this.corp !== undefined) {
      state.corpId = this.corp.name;
      state.trackCubePositions = Array.from(this.trackCubePositions.values());
      state.triggeredCubePositions = Array.from(this.triggeredCubePositions);
    }
    if (this.corpSpecificState.size > 0) {
      state.corpSpecificState = Object.fromEntries(this.corpSpecificState);
    }
    if (this.floaterCount > 0) {
      state.floaterCount = this.floaterCount;
    }
    if (this.vpByGeneration.length > 0) {
      state.vpByGeneration = this.vpByGeneration;
    }
    if (this.temperatureRaises > 0) {
      state.temperatureRaises = this.temperatureRaises;
    }
    return state;
  }

  public restoreState(state: SerializedAutomaState): void {
    // Restore track positions
    for (let i = 0; i < state.trackPositions.length && i < this.board.tracks.length; i++) {
      const track = this.board.tracks[i];
      // Set position directly
      while (track.position < state.trackPositions[i]) {
        track.advance(); // We advance without resolving actions since we're restoring state
      }
      track.regressedPositions = new Set(state.trackRegressedPositions[i] || []);
    }

    // Restore MC
    this.turnResolver.mcSupply = state.mcSupply;

    // Restore first player
    this.goesFirst = state.goesFirst;

    // Restore neural instance
    if (state.neuralInstanceSpaceId) {
      this.neuralInstanceSpace = this.game.board.spaces.find((s) => s.id === state.neuralInstanceSpaceId);
    }

    // Restore corporation state
    if (state.corpId !== undefined) {
      const corp = getMarsBotCorp(state.corpId as CardName);
      if (corp !== undefined) {
        this.corp = corp;
      }
    }
    if (state.trackCubePositions !== undefined) {
      this.trackCubePositions.clear();
      for (const cube of state.trackCubePositions) {
        this.trackCubePositions.set(trackCubeKey(cube.trackIndex, cube.position), cube);
      }
    }
    if (state.triggeredCubePositions !== undefined) {
      this.triggeredCubePositions = new Set(state.triggeredCubePositions);
    }
    if (state.corpSpecificState !== undefined) {
      this.corpSpecificState = new Map(Object.entries(state.corpSpecificState).map(([k, v]) => [k, v as number]));
    }
    if (state.floaterCount !== undefined) {
      this.floaterCount = state.floaterCount;
    }
    if (state.vpByGeneration !== undefined) {
      this.vpByGeneration = [...state.vpByGeneration];
    }
    if (state.temperatureRaises !== undefined) {
      this.temperatureRaises = state.temperatureRaises;
    }
  }

  // ---- Utilities ----

  /** Type guard to distinguish project cards from bonus cards in the action deck. */
  private isProjectCard(card: IProjectCard | MarsBotBonusCard): card is IProjectCard {
    return 'cost' in card && 'tags' in card;
  }
}
