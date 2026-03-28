import {Tag} from '../cards/Tag';
import {BonusCardId} from './AutomaTypes';

/** Corporation ID — a branded string. Individual corp IDs are added by registration. */
export type MarsBotCorpId = string & { readonly __brand: 'MarsBotCorpId' };

/** Cube type for track cubes placed by corporations. */
export type CubeType = 'white' | 'black' | 'credit';

// Draft priority — determines how MarsBot picks cards during draft
export type MarsBotDraftPriority =
  | { type: 'tags'; tags: ReadonlyArray<Tag> }     // Standard: prefer matching tags with ">" ordering
  | { type: 'mostExpensive' }                       // Credicor
  | { type: 'leastAdvancedTrack' }                  // Aridor (re-evaluated each gen)
  | { type: 'mostTags' };                            // Spire

// Cube/credit placed on a specific track position during setup
export interface MarsBotTrackCube {
  trackNum: number;       // 1-based
  position: number;       // 1-18
  cubeType: CubeType;
}

/** Composite key for track cube positions. */
export function trackCubeKey(trackNum: number, position: number): string {
  return `${trackNum}:${position}`;
}

// The main corporation interface
export interface IMarsBotCorp {
  readonly id: MarsBotCorpId;
  readonly name: string;
  readonly description: string;
  readonly startingTags: ReadonlyArray<Tag>;
  readonly draftPriority?: MarsBotDraftPriority;
  readonly setup?: { resolve(ctx: MarsBotCorpContext): void };
  readonly effect?: MarsBotCorpEffect;
  readonly perGeneration?: MarsBotCorpPerGen;
  readonly trackCubes?: ReadonlyArray<MarsBotTrackCube>;
  readonly associatedBonusCards?: ReadonlyArray<BonusCardId>;
}

export interface MarsBotCorpEffect {
  onTrackCubeTrigger?(ctx: MarsBotCorpContext, trackNum: number, position: number, cubeType: CubeType): void;
  onProjectCardResolved?(ctx: MarsBotCorpContext, card: IMarsBotCorpCardRef): void;
  onHumanCardPlayed?(ctx: MarsBotCorpContext, card: IMarsBotCorpCardRef): void;
  /** Called when any player places a tile. */
  onTilePlaced?(ctx: MarsBotCorpContext, placedByMarsBot: boolean, tileType: number): void;
  /** Called when Venus scale is raised. */
  onVenusRaised?(ctx: MarsBotCorpContext): void;
  /** Called when any global parameter is raised (temp, oxygen, venus, ocean). */
  onGlobalParameterRaised?(ctx: MarsBotCorpContext, parameter: string): boolean; // return true to SKIP the raise
  /** Called when MarsBot gains MC (for interception). Return amount to actually add. */
  onMcGained?(ctx: MarsBotCorpContext, amount: number): number;
  /** VP bonus at game end. */
  vpBonus?(ctx: MarsBotCorpContext): number;
}

export interface MarsBotCorpPerGen {
  timing: 'roundStart' | 'beforeActionPhase';
  resolve(ctx: MarsBotCorpContext): void;
}

/** Minimal card reference used in corp callbacks to avoid circular imports. */
export interface IMarsBotCorpCardRef {
  readonly name: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly cost: number;
  readonly hasRequirements: boolean;
  readonly victoryPoints: number;
}

/** Build a card ref from a project card. Avoids circular imports by taking individual fields. */
export function toCorpCardRef(name: string, tags: ReadonlyArray<Tag>, cost: number, hasRequirements: boolean, victoryPoints: number): IMarsBotCorpCardRef {
  return {name, tags, cost, hasRequirements, victoryPoints};
}

/**
 * Context object passed to all corp callbacks.
 * Defined as an interface here; the concrete object is built by MarsBot at runtime.
 */
export interface MarsBotCorpContext {
  readonly gameLog: (msg: string) => void;
  readonly advanceTrack: (trackIndex: number) => void;
  get mcSupply(): number;
  setMcSupply(mc: number): void;
  readonly trackPositions: ReadonlyArray<number>;
  readonly humanPlayerTR: number;
  readonly marsBotTR: number;
  readonly generation: number;
  /** Least-advanced track index (0-based). */
  readonly leastAdvancedTrackIndex: number;
  /** Most-advanced track index (0-based). For ties, topmost. */
  readonly mostAdvancedTrackIndex: number;
  /** Draw a project card and resolve it (returns true if resolved). */
  readonly drawAndResolveProjectCard: () => boolean;
  /** Draw a project card, resolve ignoring the first N tags (for Thorgate). */
  readonly drawAndResolveProjectCardIgnoringFirstNTags: (n: number) => boolean;
  /** Draw and resolve a bonus card (returns true if resolved). */
  readonly drawAndResolveBonusCard: () => boolean;
  /** Raise temperature by N steps. */
  readonly raiseTemperature: (steps: number) => void;
  /** Place an ocean tile. */
  readonly placeOcean: () => void;
  /** Place a city tile. */
  readonly placeCity: () => void;
  /** Place a greenery tile. */
  readonly placeGreenery: () => void;
  /** Add a project card (drawn from deck) to the current action deck. */
  readonly addProjectCardToActionDeck: (count: number) => void;
  /** Add a specific bonus card to the action deck. */
  readonly addBonusCardToActionDeck: (bonusCardId: string) => void;
  /** Remove a bonus card from the bonus deck by ID. */
  readonly removeBonusCardFromDeck: (bonusCardId: string) => void;
  /** Add a bonus card to the bonus deck by ID. */
  readonly addBonusCardToBonusDeck: (bonusCardId: string) => void;
  /** Get/set corp-specific state (for internal resources, cubes on card, etc.). */
  getCorpState(key: string): number;
  setCorpState(key: string, value: number): void;
  /** Raise MarsBot's TR. */
  readonly raiseTR: (steps: number) => void;
  /** Number of floater resources. */
  get floaterCount(): number;
  addFloaters(count: number): void;
  spendFloaters(count: number): void;
  /** Discard the card with fewest tags from the action deck (Polyphemos). */
  readonly discardFewestTagsFromActionDeck: () => void;
  /** Convenience: gain M€ (adds to mcSupply). */
  readonly gainMc: (amount: number) => void;
}
