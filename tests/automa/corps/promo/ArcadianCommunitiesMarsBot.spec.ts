import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ArcadianCommunitiesMarsBot} from '@/server/automa/corps/promo/ArcadianCommunitiesMarsBot';
import {testGame} from '../../../TestGame';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('ArcadianCommunitiesMarsBot', () => {
  it('resolves Settlers at setup, and it is its action deck bonus card', () => {
    const {marsBot, calls} = recordingMarsBot();

    new ArcadianCommunitiesMarsBot().setup(marsBot);

    expect(calls).deep.eq(['resolveBonusCard(Settlers)']);
    expect(new ArcadianCommunitiesMarsBot().actionDeckBonusCard).eq(BonusCardName.SETTLERS);
  });

  it('pays 3 M€ for the tile MarsBot puts on a space with its marker, and no one else', () => {
    const [game] = testGame(1);
    const [markedByPlayerTile, markedByBotTile, unmarked] = game.board.spaces;
    const markers = new Set([markedByPlayerTile, markedByBotTile]);
    const {marsBot, calls} = recordingMarsBot({game, removeMarker: (space) => markers.delete(space)});
    const corp = new ArcadianCommunitiesMarsBot();

    corp.onTilePlaced(marsBot, false, TileType.CITY, markedByPlayerTile);
    corp.onTilePlaced(marsBot, true, TileType.CITY, unmarked);
    corp.onTilePlaced(marsBot, true, TileType.CITY, markedByBotTile);

    expect(calls).deep.eq(['gainMc(3)']);
  });
});
