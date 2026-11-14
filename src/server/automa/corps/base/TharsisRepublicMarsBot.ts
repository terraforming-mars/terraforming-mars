import {TileType} from '@/common/TileType';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C10 Tharsis Republic ----
// Draft: City. Setup: place 1 city. Effect: the player's city gives +2 MC; MarsBot's city advances event track.
export const THARSIS_REPUBLIC_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.THARSIS_REPUBLIC,
  description: 'Draft: City. Setup: place 1 city. When you place a city, MarsBot gains 2 MC. When MarsBot places a city (setup included), advance its event track.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.CITY]},
  setup(marsBot) {
    marsBot.placeCity();
    marsBot.game.log('MarsBot (Tharsis Republic): placed 1 city tile');
  },
  effect: {
    onTilePlaced(marsBot, placedByMarsBot, tileType) {
      if (tileType === TileType.CITY || tileType === TileType.CAPITAL) {
        if (placedByMarsBot) {
          marsBot.advanceTrack(2); // Event track = index 2
          marsBot.game.log('MarsBot (Tharsis Republic): MarsBot city, advance event track');
        } else {
          marsBot.gainMc(2);
          marsBot.game.log('MarsBot (Tharsis Republic): player city placed, +2 M€');
        }
      }
    },
  },
};
