import {expect} from 'chai';
import {Recession} from '../../../src/server/cards/prelude2/Recession';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('Recession', () => {
  let card: Recession;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Recession();
    [game, player, player2, player3] = testGame(3);
  });

  const canPlayRuns = [
    {production: [0, 0, 0], expected: true},
    {production: [0, -4, 0], expected: true},
    {production: [-5, 0, 0], expected: true},
    {production: [0, -5, 0], expected: false},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.production.override({megacredits: run.production[0]});
      player2.production.override({megacredits: run.production[1]});
      player3.production.override({megacredits: run.production[2]});
      expect(player.canPlay(card)).eq(run.expected);
    });
  }

  it('play', () => {
    player.megaCredits = 4;
    player2.megaCredits = 8;
    player3.megaCredits = 3;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.megaCredits).eq(14);
    expect(player2.megaCredits).eq(3);
    expect(player3.megaCredits).eq(0);
    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(-1);
    expect(player3.production.megacredits).eq(-1);
  });
});
