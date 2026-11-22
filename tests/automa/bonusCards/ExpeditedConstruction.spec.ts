import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {ExpeditedConstruction} from '@/server/automa/bonusCards/ExpeditedConstruction';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExpeditedConstruction', () => {
  // Space 12 is next to all three oceans and has no icons, so the city earns 2 M€ per ocean
  it('places a city next to 2 greenery or ocean tiles, earns its placement M€ and is destroyed', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0});
    for (const id of ['06', '07', '13'] as const) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(id), {tileType: TileType.OCEAN});
    }

    const destroyed = new ExpeditedConstruction().resolve(marsBot);

    const city = game.board.getSpaceOrThrow('12');
    expect(city.tile?.tileType).eq(TileType.CITY);
    expect(city.player).eq(botPlayer);
    expect(calls).deep.eq(['gainMc(6)']);
    expect(destroyed).is.true;
  });

  it('places nothing and is kept when no space is next to 2 such tiles', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0});

    const destroyed = new ExpeditedConstruction().resolve(marsBot);

    const tiles = game.board.spaces.filter((space) => space.tile !== undefined);
    expect(tiles).is.empty;
    expect(calls).is.empty;
    expect(destroyed).is.false;
  });
});
