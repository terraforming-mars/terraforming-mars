import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {ExpeditedConstructionColonies} from '@/server/automa/bonusCards/ExpeditedConstructionColonies';
import {Ceres} from '@/server/colonies/Ceres';
import {Luna} from '@/server/colonies/Luna';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExpeditedConstructionColonies', () => {
  // Space 12 is next to all three oceans and has no icons, so the city earns 2 M€ per ocean
  it('places a city next to 2 greenery or ocean tiles and is destroyed', () => {
    const [game, human, botPlayer] = testGame(2, {coloniesExtension: true});
    const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0});
    for (const id of ['06', '07', '13'] as const) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(id), {tileType: TileType.OCEAN});
    }

    const destroyed = new ExpeditedConstructionColonies().resolve(marsBot);

    const city = game.board.getSpaceOrThrow('12');
    expect(city.tile?.tileType).eq(TileType.CITY);
    expect(calls).deep.eq(['gainMc(6)']);
    expect(destroyed).is.true;
  });

  for (const run of [
    {botColonies: 0, expected: ['maybePlaceRandomColony()']},
    {botColonies: 1, expected: ['maybePlaceRandomColony()']},
    {botColonies: 2, expected: []},
  ] as const) {
    it('without a city space, places a colony while MarsBot has at most 1 and is kept: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2, {coloniesExtension: true});
      const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0});
      game.colonies = [new Luna(), new Ceres()];
      for (const colony of game.colonies.slice(0, run.botColonies)) {
        colony.colonies.push(botPlayer.id);
      }

      const destroyed = new ExpeditedConstructionColonies().resolve(marsBot);

      expect(calls).deep.eq(run.expected);
      expect(destroyed).is.false;
    });
  }
});
