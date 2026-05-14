/**
 * Shared helper functions for MarsBot corporation definitions.
 */
import {MarsBotTrackCube, MarsBotCorpContext, CubeType} from '../MarsBotCorpTypes';
import {BonusCardId} from '../../../common/automa/AutomaTypes';

/** Generate white cubes for all 18 positions on a track (replaces transparent cubes). */
export function whiteTrackCubes(trackIndex: number): MarsBotTrackCube[] {
  return Array.from({length: 18}, (_, i) => ({trackIndex, position: i + 1, cubeType: 'white' as const}));
}

/** Factory for the common "add bonus card to action deck before action phase" per-gen pattern. */
export function bonusCardPerGen(bonusCardId: BonusCardId, corpName: string): {timing: 'beforeActionPhase', resolve: (ctx: MarsBotCorpContext) => void} {
  return {
    timing: 'beforeActionPhase',
    resolve(ctx) {
      ctx.addBonusCardToActionDeck(bonusCardId);
      ctx.gameLog(`MarsBot (${corpName}): ${bonusCardId} added to action deck`);
    },
  };
}

/** Factory for the common "add 1 floater at round start" per-gen pattern. */
export function floaterPerRound(corpName: string): {timing: 'roundStart', resolve: (ctx: MarsBotCorpContext) => void} {
  return {
    timing: 'roundStart',
    resolve(ctx) {
      ctx.addFloaters(1);
      ctx.gameLog(`MarsBot (${corpName}): round start, +1 floater`);
    },
  };
}

/** Shared cube handler: white -> advance least-advanced track, black -> advance space track. */
export function whiteLeastBlackSpaceHandler(ctx: MarsBotCorpContext, cubeType: CubeType, corpName: string): void {
  if (cubeType === 'white') {
    ctx.advanceTrack(ctx.leastAdvancedTrackIndex);
    ctx.gameLog(`MarsBot (${corpName}): white cube — advance least-advanced track`);
  } else if (cubeType === 'black') {
    ctx.advanceTrack(1);
    ctx.gameLog(`MarsBot (${corpName}): black cube — advance space track`);
  }
}
