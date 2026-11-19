import {expect} from 'chai';
import {GovernmentInterventionMarsBot} from '@/server/automa/bonusCards/GovernmentInterventionMarsBot';
import {testGame} from '../../TestGame';
import {maxOutOceans, setOxygenLevel, setTemperature, setVenusScaleLevel} from '../../TestingUtils';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('GovernmentInterventionMarsBot', () => {
  for (const run of [
    {generation: 2, venus: 0, marsComplete: false, after: {temperature: -28, venus: 0}},
    {generation: 3, venus: 0, marsComplete: false, after: {temperature: -30, venus: 2}},
    {generation: 3, venus: 30, marsComplete: false, after: {temperature: -28, venus: 30}},
    {generation: 2, venus: 0, marsComplete: true, after: {temperature: 8, venus: 2}},
  ] as const) {
    it('raises a Martian parameter on an even generation or with Venus complete, else Venus, for no TR: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2, {venusNextExtension: true});
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      game.generation = run.generation;
      setVenusScaleLevel(game, run.venus);
      if (run.marsComplete) {
        setTemperature(game, 8);
        setOxygenLevel(game, 14);
        maxOutOceans(human);
      }
      const tr = botPlayer.terraformRating;

      new GovernmentInterventionMarsBot().resolve(marsBot);

      expect({temperature: game.getTemperature(), venus: game.getVenusScaleLevel()}).deep.eq(run.after);
      expect(botPlayer.terraformRating).eq(tr);
    });
  }

  it('keeps no M€ from the ocean it places', () => {
    const [game, human, botPlayer] = testGame(2, {venusNextExtension: true});
    const {marsBot} = recordingMarsBot({
      game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false,
      gainMc: (amount) => {
        marsBot.megacredits += amount;
      },
    });
    game.generation = 2;
    // Oceans have the most steps left
    setTemperature(game, 0);
    setOxygenLevel(game, 9);

    new GovernmentInterventionMarsBot().resolve(marsBot);

    expect(game.board.getOceanSpaces()).has.length(1);
    expect(marsBot.megacredits).eq(0);
  });
});
