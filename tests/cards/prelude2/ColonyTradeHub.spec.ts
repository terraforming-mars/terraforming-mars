import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {ColonyTradeHub} from '../../../src/server/cards/prelude2/ColonyTradeHub';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Units} from '../../../src/common/Units';


describe('ColonyTradeHub', function() {
  let card: ColonyTradeHub;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ColonyTradeHub();
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true});
    // Setup some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres()];
  });

  it('play', () => {
    card.play(player);
    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 3}));
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });

  const onColonyAddedRuns = [
    {player: 0, colony: 0, expected: [2, 0]},
    {player: 0, colony: 1, expected: [2, 0]},
    {player: 1, colony: 0, expected: [2, 0]},
    {player: 1, colony: 1, expected: [2, 0]},
  ] as const;
  for (const run of onColonyAddedRuns) {
    it('Gains 2 M€ when any colony is added building a colony ' + JSON.stringify(run), function() {
      const players = game.getPlayers();
      players[0].playedCards.push(card);

      expect(player.stock.asUnits()).deep.eq(Units.of({}));
      expect(player2.stock.asUnits()).deep.eq(Units.of({}));

      game.colonies[run.colony].addColony(players[run.player]);

      expect(players[0].stock.asUnits()).deep.eq(Units.of({megacredits: run.expected[0]}));
      expect(players[1].stock.asUnits()).deep.eq(Units.of({megacredits: run.expected[1]}));
    });
  }
});
