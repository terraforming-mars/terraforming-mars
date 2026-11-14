/**
 * Shared helper functions for MarsBot corporation definitions.
 */
import {IMarsBot} from '../IMarsBot';
import {ACTION_DECK_BONUS_CARD_REMOVED, IMarsBotCorp} from '../IMarsBotCorp';
import {MarsBotTrackCube} from '../MarsBotCorpTypes';
import {BonusCardId, CubeType} from '../../../common/automa/AutomaTypes';

/** M€ a silver resource cube is worth, which the bot gains on reaching a `credit` cube (Cheung Shing, Morningstar). */
export const SILVER_CUBE_MC = 5;

/** Generate white cubes for all 18 positions on a track (replaces transparent cubes). */
export function whiteTrackCubes(trackIndex: number): MarsBotTrackCube[] {
  return Array.from({length: 18}, (_, i) => ({trackIndex, position: i + 1, cubeType: 'white' as const}));
}

/** Corp fields for the common "add bonus card to action deck before the action phase" pattern. */
export function bonusCardBeforeActionPhase(bonusCardId: BonusCardId, corpName: string): Pick<IMarsBotCorp, 'actionDeckBonusCard' | 'beforeActionPhase'> {
  return {
    actionDeckBonusCard: bonusCardId,
    beforeActionPhase: (marsBot) => {
      if (marsBot.getCorpState(ACTION_DECK_BONUS_CARD_REMOVED) > 0) {
        return;
      }
      marsBot.addBonusCardToActionDeck(bonusCardId);
      marsBot.game.log(`MarsBot (${corpName}): ${bonusCardId} added to action deck`);
    },
  };
}

/** Factory for the common "add 1 floater at round start" pattern. */
export function floaterAtRoundStart(corpName: string): (marsBot: IMarsBot) => void {
  return (marsBot) => {
    marsBot.addFloaters(1);
    marsBot.game.log(`MarsBot (${corpName}): round start, +1 floater`);
  };
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
