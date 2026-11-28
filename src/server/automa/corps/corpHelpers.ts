/**
 * Shared helper functions for MarsBot corporation definitions.
 */
import {CardName} from '../../../common/cards/CardName';
import {IMarsBot} from '../IMarsBot';
import {MarsBotTrackCube} from '../MarsBotCorpTypes';
import {CubeType} from '../../../common/automa/AutomaTypes';

/** Corp state key, set to 1 once the corporation's `actionDeckBonusCard` removed itself from the game. */
export const ACTION_DECK_BONUS_CARD_REMOVED = 'actionDeckBonusCardRemoved';

/** M€ a silver resource cube is worth, which the bot gains on reaching a `credit` cube (Cheung Shing, Morning Star). */
export const SILVER_CUBE_MC = 5;

/** White cubes on all 18 positions of a track. */
export function whiteTrackCubes(trackIndex: number): MarsBotTrackCube[] {
  return Array.from({length: 18}, (_, i) => ({trackIndex, position: i + 1, cubeType: 'white' as const}));
}

/**
 * Resolves the track cube rule Point Luna and Astrodrill share: a white cube advances MarsBot's
 * least-advanced track, a black cube advances its space track.
 */
export function whiteLeastBlackSpaceHandler(marsBot: IMarsBot, cubeType: CubeType, corpName: CardName): void {
  if (cubeType === 'white') {
    marsBot.advanceTrack(marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
    marsBot.game.log('MarsBot (${0}): white cube: advance least-advanced track', (b) => b.cardName(corpName));
  } else if (cubeType === 'black') {
    marsBot.advanceTrack(1);
    marsBot.game.log('MarsBot (${0}): black cube: advance space track', (b) => b.cardName(corpName));
  }
}
