import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {RapidSproutingMarsBot} from '@/server/automa/bonusCards/RapidSproutingMarsBot';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('RapidSproutingMarsBot', () => {
  for (const run of [
    {plants: 0, after: {plants: 1, greeneries: 0, oxygen: 0}},
    {plants: 1, after: {plants: 0, greeneries: 1, oxygen: 1}},
  ] as const) {
    it('puts a plant on the corporation card, or spends it on a greenery: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot, corpState} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      corpState.set('plantResources', run.plants);

      new RapidSproutingMarsBot().resolve(marsBot);

      expect({
        plants: corpState.get('plantResources'),
        greeneries: game.board.getGreeneries(botPlayer).length,
        oxygen: game.getOxygenLevel(),
      }).deep.eq(run.after);
    });
  }

  it('spends the plant when no greenery can be placed', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot, corpState} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
    corpState.set('plantResources', 1);
    for (const space of game.board.getAvailableSpacesOnLand(human)) {
      game.simpleAddTile(human, space, {tileType: TileType.GREENERY});
    }

    new RapidSproutingMarsBot().resolve(marsBot);

    expect(game.board.getGreeneries(botPlayer)).is.empty;
    expect(corpState.get('plantResources')).eq(0);
  });
});
