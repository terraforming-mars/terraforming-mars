import {expect} from 'chai';
import {EarthquakeMachine} from '../../../src/server/cards/underworld/EarthquakeMachine';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';

describe('EarthquakeMachine', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: EarthquakeMachine;

  beforeEach(() => {
    card = new EarthquakeMachine();
    [game, player, player2, player3] = testGame(3, {underworldExpansion: true});
  });

  const canPlayRuns = [
    {it: '1', scienceTags: 1, opponentPlantProduction: 0, expected: false},
    {it: '2', scienceTags: 1, opponentPlantProduction: 1, expected: false},
    {it: '3', scienceTags: 2, opponentPlantProduction: 0, expected: false},
    {it: '4', scienceTags: 2, opponentPlantProduction: 1, expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('canPlay ' + run.it, () => {
      player.tagsForTest = {science: run.scienceTags};
      player3.production.override({plants: run.opponentPlantProduction});
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('canPlay', () => {
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    player.production.override({plants: 1});
    player3.production.override({plants: 1});
    cast(card.play(player), undefined);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player, player3]);
    expect(selectPlayer.players).to.not.have.members([player2]);

    selectPlayer.cb(player3);

    expect(player3.production.plants).eq(0);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;
    player.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {

  });
});
