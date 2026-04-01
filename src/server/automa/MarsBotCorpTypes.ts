import {Tag} from '../../common/cards/Tag';
import {CardName} from '../../common/cards/CardName';
import {BonusCardId, CubeType} from '../../common/automa/AutomaTypes';
export {CubeType};

export type MarsBotDraftPriority =
  | { type: 'tags'; tags: ReadonlyArray<Tag> }
  | { type: 'mostExpensive' }
  | { type: 'leastAdvancedTrack' }
  | { type: 'mostTags' };

export type MarsBotTrackCube = {
  trackIndex: number;
  position: number;
  cubeType: CubeType;
};

export function trackCubeKey(trackIndex: number, position: number): string {
  return `${trackIndex}:${position}`;
}

export interface IMarsBotCorp {
  readonly name: CardName;
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
  onTrackCubeTrigger?(ctx: MarsBotCorpContext, trackIndex: number, position: number, cubeType: CubeType): void;
  onProjectCardResolved?(ctx: MarsBotCorpContext, card: MarsBotCorpCardRef): void;
  onHumanCardPlayed?(ctx: MarsBotCorpContext, card: MarsBotCorpCardRef): void;
  onTilePlaced?(ctx: MarsBotCorpContext, placedByMarsBot: boolean, tileType: number): void;
  onVenusRaised?(ctx: MarsBotCorpContext): void;
  onGlobalParameterRaised?(ctx: MarsBotCorpContext, parameter: string): boolean;
  onMcGained?(ctx: MarsBotCorpContext, amount: number): number;
  vpBonus?(ctx: MarsBotCorpContext): number;
}

export type MarsBotCorpPerGen = {
  timing: 'roundStart' | 'beforeActionPhase';
  resolve(ctx: MarsBotCorpContext): void;
};

export type MarsBotCorpCardRef = {
  readonly name: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly cost: number;
  readonly hasRequirements: boolean;
  readonly victoryPoints: number;
};

export function toCorpCardRef(name: string, tags: ReadonlyArray<Tag>, cost: number, hasRequirements: boolean, victoryPoints: number): MarsBotCorpCardRef {
  return {name, tags, cost, hasRequirements, victoryPoints};
}

export interface MarsBotCorpContext {
  readonly gameLog: (msg: string) => void;
  readonly advanceTrack: (trackIndex: number) => void;
  get mcSupply(): number;
  setMcSupply(mc: number): void;
  readonly trackPositions: ReadonlyArray<number>;
  readonly humanPlayerTR: number;
  readonly marsBotTR: number;
  readonly generation: number;
  readonly leastAdvancedTrackIndex: number;
  readonly mostAdvancedTrackIndex: number;
  readonly drawAndResolveProjectCard: () => boolean;
  readonly drawAndResolveProjectCardIgnoringFirstNTags: (n: number) => boolean;
  readonly drawAndResolveBonusCard: () => boolean;
  readonly raiseTemperature: (steps: number) => void;
  readonly placeOcean: () => void;
  readonly placeCity: () => void;
  readonly placeGreenery: () => void;
  readonly addProjectCardToActionDeck: (count: number) => void;
  readonly addBonusCardToActionDeck: (bonusCardId: string) => void;
  readonly removeBonusCardFromDeck: (bonusCardId: string) => void;
  readonly addBonusCardToBonusDeck: (bonusCardId: string) => void;
  getCorpState(key: string): number;
  setCorpState(key: string, value: number): void;
  readonly raiseTR: (steps: number) => void;
  get floaterCount(): number;
  addFloaters(count: number): void;
  spendFloaters(count: number): void;
  readonly discardFewestTagsFromActionDeck: () => void;
  readonly gainMc: (amount: number) => void;
}
