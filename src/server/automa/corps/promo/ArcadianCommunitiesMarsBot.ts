import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C18 Acadian Community
export const ARCADIAN_COMMUNITIES_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.ARCADIAN_COMMUNITIES,
  description: 'Tag: Building. Setup: resolve Settlers immediately. Each generation: add Settlers to action deck. ' +
    'Spaces with its player markers are reserved for it. Each tile it places on one of them earns 3 MC.',
  tags: [Tag.BUILDING],
  setup(marsBot) {
    marsBot.resolveBonusCard(BonusCardId.B22_SETTLERS);
  },
  effect: {
    onTilePlaced(marsBot, placedByMarsBot, _tileType, space) {
      if (placedByMarsBot && marsBot.removeMarker(space)) {
        marsBot.gainMc(3);
        marsBot.game.log('MarsBot (Acadian Community): tile on its player marker, +3 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B22_SETTLERS, 'Acadian Community'),
};
