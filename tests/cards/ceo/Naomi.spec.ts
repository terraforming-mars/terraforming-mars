import {expect} from 'chai';
import {MAX_COLONY_TRACK_POSITION} from '../../../src/common/constants';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {forceGenerationEnd} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Naomi} from '../../../src/server/cards/ceos/Naomi';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Units} from '../../../src/common/Units';

describe('Naomi', function() {
  let card: Naomi;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Naomi();
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true});
    // Setup some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres()];
  });

  const onColonyAddedRuns = [
    {player: 0, colony: 0, expected: [[2, 3], [0, 0]]},
    {player: 0, colony: 1, expected: [[2, 3], [0, 0]]},
    {player: 1, colony: 0, expected: [[0, 0], [0, 0]]},
    {player: 1, colony: 1, expected: [[0, 0], [0, 0]]},
  ] as const;
  for (const run of onColonyAddedRuns) {
    it('Gains 2 energy and 2 M€ when building a colony ' + JSON.stringify(run), function() {
      const players = game.getPlayers();
      players[0].playedCards.push(card);

      expect(player.stock.asUnits()).deep.eq(Units.of({}));
      expect(player2.stock.asUnits()).deep.eq(Units.of({}));

      game.colonies[run.colony].addColony(players[run.player]);

      expect(players[0].stock.asUnits()).deep.eq(Units.of({energy: run.expected[0][0], megacredits: run.expected[0][1]}));
      expect(players[1].stock.asUnits()).deep.eq(Units.of({energy: run.expected[1][0], megacredits: run.expected[1][1]}));
    });
  }

  it('Takes action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(2);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    expect(game.colonies[0].trackPosition).eq(MAX_COLONY_TRACK_POSITION);
    expect(game.colonies[1].trackPosition).eq(0);

    expect(card.canAct(player)).is.false;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
