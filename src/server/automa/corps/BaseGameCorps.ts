/**
 * Shared helper functions for MarsBot corporation definitions.
 */
import {IMarsBot} from '../IMarsBot';
import {MarsBotTrackCube} from '../MarsBotCorpTypes';
import {BonusCardId, CubeType} from '../../../common/automa/AutomaTypes';

/** M€ a silver resource cube is worth, which the bot gains on reaching a `credit` cube (Cheung Shing, Morningstar). */
export const SILVER_CUBE_MC = 5;

/** Generate white cubes for all 18 positions on a track (replaces transparent cubes). */
export function whiteTrackCubes(trackIndex: number): MarsBotTrackCube[] {
  return Array.from({length: 18}, (_, i) => ({trackIndex, position: i + 1, cubeType: 'white' as const}));
}

/** The common "add the corp's bonus card to the action deck before the action phase" pattern. */
export function addBonusCardBeforeActionPhase(marsBot: IMarsBot, bonusCardId: BonusCardId, corpName: string): void {
  marsBot.addBonusCardToActionDeck(bonusCardId);
  marsBot.game.log(`MarsBot (${corpName}): ${bonusCardId} added to action deck`);
}

/** The common "add 1 floater at round start" pattern. */
export function addFloaterAtRoundStart(marsBot: IMarsBot, corpName: string): void {
  marsBot.addFloaters(1);
  marsBot.game.log(`MarsBot (${corpName}): round start, +1 floater`);
}

/** Shared cube handler: white -> advance least-advanced track, black -> advance space track. */
export function whiteLeastBlackSpaceHandler(marsBot: IMarsBot, cubeType: CubeType, corpName: string): void {
  if (cubeType === 'white') {
    marsBot.advanceTrack(marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
    marsBot.game.log(`MarsBot (${corpName}): white cube: advance least-advanced track`);
  } else if (cubeType === 'black') {
    marsBot.advanceTrack(1);
    marsBot.game.log(`MarsBot (${corpName}): black cube: advance space track`);
  }
}
