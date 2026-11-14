import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {SILVER_CUBE_MC} from '@/server/automa/corps/BaseGameCorps';

// C27 Morningstar Inc.
export const MORNING_STAR_INC_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.MORNING_STAR_INC,
  description: 'Tags: 2 Venus. Setup: remove Lobbyists, add Venusian Lobby. Silver resource cubes on Venus track earn 5 MC each.',
  tags: [Tag.VENUS, Tag.VENUS],
  requiredExpansions: ['venus'],
  setup(marsBot) {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardId.B06_LOBBYISTS);
    marsBot.removeBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    marsBot.addBonusCardToBonusDeck(BonusCardId.B26_VENUSIAN_LOBBY);
    marsBot.game.log('MarsBot (Morningstar): Lobbyists removed, Venusian Lobby added');
  },
  // Silver resource cubes on the Venus track (index 7, present only on the Venus board) at positions 5-9 and 11-12.
  trackCubes: [5, 6, 7, 8, 9, 11, 12].map((position) => ({trackIndex: 7, position, cubeType: 'credit' as const})),
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'credit') {
        marsBot.gainMc(SILVER_CUBE_MC);
        marsBot.game.log('MarsBot (Morningstar): silver resource cube, +5 M€');
      }
    },
  },
};
