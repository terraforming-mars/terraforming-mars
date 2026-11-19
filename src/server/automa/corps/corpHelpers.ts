/**
 * Shared helper functions for MarsBot corporation definitions.
 */
import {CardName} from '../../../common/cards/CardName';
import {IMarsBot} from '../IMarsBot';
import {MarsBotTrackCube} from '../MarsBotCorpTypes';
import {BonusCardId, CubeType} from '../../../common/automa/AutomaTypes';

/** M€ a silver resource cube is worth, which the bot gains on reaching a `credit` cube (Cheung Shing, Morning Star). */
export const SILVER_CUBE_MC = 5;

/** White cubes on all 18 positions of a track. */
export function whiteTrackCubes(trackIndex: number): MarsBotTrackCube[] {
  return Array.from({length: 18}, (_, i) => ({trackIndex, position: i + 1, cubeType: 'white' as const}));
}

/** The common "add the corp's bonus card to the action deck before the action phase" pattern. */
export function addBonusCardBeforeActionPhase(marsBot: IMarsBot, bonusCardId: BonusCardId, corpName: CardName): void {
  marsBot.addBonusCardToActionDeck(bonusCardId);
  marsBot.game.log('MarsBot (${0}): ${1} added to action deck', (b) => b.cardName(corpName).rawString(bonusCardId));
}

/** The common "add 1 floater at round start" pattern. */
export function addFloaterAtRoundStart(marsBot: IMarsBot, corpName: CardName): void {
  marsBot.addFloaters(1);
  marsBot.game.log('MarsBot (${0}): round start, +1 floater', (b) => b.cardName(corpName));
}

/** Shared cube handler: white -> advance least-advanced track, black -> advance space track. */
export function whiteLeastBlackSpaceHandler(marsBot: IMarsBot, cubeType: CubeType, corpName: CardName): void {
  if (cubeType === 'white') {
    marsBot.advanceTrack(marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
    marsBot.game.log('MarsBot (${0}): white cube: advance least-advanced track', (b) => b.cardName(corpName));
  } else if (cubeType === 'black') {
    marsBot.advanceTrack(1);
    marsBot.game.log('MarsBot (${0}): black cube: advance space track', (b) => b.cardName(corpName));
  }
}
