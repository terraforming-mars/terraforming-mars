import {expect} from 'chai';
import {GlobalParameter} from '@/common/GlobalParameter';
import {TileType} from '@/common/TileType';
import {SpaceId} from '@/common/Types';
import {LobbyistsMarsBot} from '@/server/automa/bonusCards/LobbyistsMarsBot';
import {testGame} from '../../TestGame';
import {maxOutOceans, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('LobbyistsMarsBot', () => {
  for (const run of [
    {temperature: -28, after: -24},
    {temperature: -26, after: -22},
    {temperature: 4, after: 8},
  ] as const) {
    it('raises the temperature 2 steps and is destroyed when 1 or 2 steps from a bonus or the maximum: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      setTemperature(game, run.temperature);

      const destroyed = new LobbyistsMarsBot().resolve(marsBot);

      expect(game.getTemperature()).eq(run.after);
      expect(destroyed).is.true;
    });
  }

  it('raises the temperature 1 step when a corp cancels the raise', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({
      game, player: botPlayer, humanPlayer: human, megacredits: 0,
      interceptsParameterRaise: (parameter) => parameter === GlobalParameter.TEMPERATURE,
    });
    setTemperature(game, -26);

    new LobbyistsMarsBot().resolve(marsBot);

    expect(game.getTemperature()).eq(-24);
  });

  for (const run of [
    {oxygen: 6, after: 8},
    {oxygen: 13, after: 14},
  ] as const) {
    it('places a greenery, raises the oxygen once more and is destroyed when 1 or 2 steps from a bonus or the maximum: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      setOxygenLevel(game, run.oxygen);

      const destroyed = new LobbyistsMarsBot().resolve(marsBot);

      expect(game.board.getGreeneries(botPlayer)).has.length(1);
      expect(game.getOxygenLevel()).eq(run.after);
      expect(destroyed).is.true;
    });
  }

  for (const run of [
    // Spaces 07 (no bonus) and 43 (one plant) each touch two of these, and 43 covers more icons.
    // 43 pays 1 M€ for the plant icon and 2 M€ for each adjacent ocean.
    {oceans: ['06', '13', '34', '44'], after: ['06', '13', '34', '43', '44'], calls: ['gainMc(5)'], destroyed: true},
    {oceans: ['34'], after: ['34'], calls: [], destroyed: false},
  ] as const) {
    it('places an ocean only next to 2 oceans, and is then destroyed: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      for (const id of run.oceans) {
        game.simpleAddTile(human, game.board.getSpaceOrThrow(id as SpaceId), {tileType: TileType.OCEAN});
      }

      const destroyed = new LobbyistsMarsBot().resolve(marsBot);

      expect(game.board.getOceanSpaces().map((space) => space.id).sort()).deep.eq(run.after);
      expect(calls).deep.eq(run.calls);
      expect(destroyed).eq(run.destroyed);
    });
  }

  for (const run of [
    {temperature: -30, oxygen: 0, oceans: 0, after: {temperature: -28, oxygen: 0, oceans: 0}},
    {temperature: 0, oxygen: 0, oceans: 0, after: {temperature: 0, oxygen: 1, oceans: 0}},
    {temperature: 0, oxygen: 9, oceans: 0, after: {temperature: 0, oxygen: 9, oceans: 1}},
    // Oxygen and temperature both have 9 steps left, though temperature is further along
    {temperature: -10, oxygen: 5, oceans: 9, after: {temperature: -10, oxygen: 6, oceans: 9}},
  ] as const) {
    it('otherwise raises the parameter with the most steps left and is kept: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      setTemperature(game, run.temperature);
      setOxygenLevel(game, run.oxygen);
      maxOutOceans(human, run.oceans);

      const destroyed = new LobbyistsMarsBot().resolve(marsBot);

      expect({
        temperature: game.getTemperature(),
        oxygen: game.getOxygenLevel(),
        oceans: game.board.getOceanSpaces().length,
      }).deep.eq(run.after);
      expect(destroyed).is.false;
    });
  }
});
