import {expect} from 'chai';
import {InfrastructureOverload} from '../../../src/server/cards/underworld/InfrastructureOverload';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('InfrastructureOverload', () => {
  let card: InfrastructureOverload;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new InfrastructureOverload();
    [game, player, player2, player3] = testGame(3);
  });

  const canPlayRuns = [
    {opponentEnergyProduction: 1, expected: false},
    {opponentEnergyProduction: 2, expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player3.production.override({energy: run.opponentEnergyProduction});
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('Should play', () => {
    player2.production.add(Resource.ENERGY, 2);
    player3.production.add(Resource.ENERGY, 7);

    card.play(player);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    expect(player2.production.energy).to.eq(0);
    expect(player3.production.energy).to.eq(7);
  });
});
