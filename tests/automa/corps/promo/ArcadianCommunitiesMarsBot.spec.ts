import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {ARCADIAN_COMMUNITIES_MARSBOT_CORP} from '@/server/automa/corps/promo/ArcadianCommunitiesMarsBot';
import {testGame} from '../../../TestGame';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('ArcadianCommunitiesMarsBot', () => {
  it('resolves Settlers at setup, and it is its action deck bonus card', () => {
    const {marsBot, calls} = recordingMarsBot();

    ARCADIAN_COMMUNITIES_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['resolveBonusCard(B22)']);
    expect(ARCADIAN_COMMUNITIES_MARSBOT_CORP.actionDeckBonusCard).eq(BonusCardId.B22_SETTLERS);
  });

  it('pays 3 M€ for the tile MarsBot puts on a space with its marker, and no one else', () => {
    const [game] = testGame(1);
    const [markedByPlayerTile, markedByBotTile, unmarked] = game.board.spaces;
    const markers = new Set([markedByPlayerTile, markedByBotTile]);
    const {marsBot, calls} = recordingMarsBot({game, removeMarker: (space) => markers.delete(space)});
    const onTilePlaced = ARCADIAN_COMMUNITIES_MARSBOT_CORP.effect!.onTilePlaced!;

    onTilePlaced(marsBot, false, TileType.CITY, markedByPlayerTile);
    onTilePlaced(marsBot, true, TileType.CITY, unmarked);
    onTilePlaced(marsBot, true, TileType.CITY, markedByBotTile);

    expect(calls).deep.eq(['gainMc(3)']);
  });
});
