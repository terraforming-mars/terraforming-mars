import {TileType} from '@/common/TileType';
import {LAKEFRONT_OCEAN_BONUS} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C35 Lakefront Resorts
export const LAKEFRONT_RESORTS_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.LAKEFRONT_RESORTS,
  description: 'Setup: 1 white cube on card. Oceans alternate between removing the cube (advance building track) and placing it back. Ocean adjacency pays 3 MC.',
  tags: [],
  setup(marsBot) {
    marsBot.player.oceanBonus = LAKEFRONT_OCEAN_BONUS;
    marsBot.setCorpState('whiteCubeOnCard', 1);
    marsBot.game.log('MarsBot (Lakefront): 1 white cube on card');
  },
  effect: {
    onTilePlaced(marsBot, _placedByMarsBot, tileType) {
      if (tileType === TileType.OCEAN) {
        const cube = marsBot.getCorpState('whiteCubeOnCard');
        if (cube > 0) {
          marsBot.setCorpState('whiteCubeOnCard', 0);
          const mcBefore = marsBot.megacredits;
          marsBot.advanceTrack(0); // Building track = index 0
          // FAQ (rulebook B, p.4): this overrides Government Intervention's "no M€", but not its "no TR"
          if (marsBot.mcKeptThroughIntervention !== undefined) {
            marsBot.mcKeptThroughIntervention += Math.max(0, marsBot.megacredits - mcBefore);
          }
          marsBot.game.log('MarsBot (Lakefront): ocean placed, removed cube, advance building track');
        } else {
          marsBot.setCorpState('whiteCubeOnCard', 1);
          marsBot.game.log('MarsBot (Lakefront): ocean placed, placed white cube on card');
        }
      }
    },
  },
};
