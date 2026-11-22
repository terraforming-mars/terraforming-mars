import {expect} from 'chai';
import {DoItRight} from '@/server/automa/bonusCards/DoItRight';
import {testGame} from '../../TestGame';
import {setTemperature} from '../../TestingUtils';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('DoItRight', () => {
  for (const run of [
    {temperature: -26, expected: -22},
    {temperature: -30, expected: -30},
  ] as const) {
    it('resolves the first Lobbyists branch that applies, else nothing, and is never destroyed: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      setTemperature(game, run.temperature);

      const destroyed = new DoItRight().resolve(marsBot);

      expect(game.getTemperature()).eq(run.expected);
      expect(game.getOxygenLevel()).eq(0);
      expect(game.board.getOceanSpaces()).is.empty;
      expect(destroyed).is.false;
    });
  }
});
