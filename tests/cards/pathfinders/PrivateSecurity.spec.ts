import {expect} from 'chai';
import {PrivateSecurity} from '../../../src/cards/pathfinders/PrivateSecurity';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {HiredRaiders} from '../../../src/cards/base/HiredRaiders';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('PrivateSecurity', function() {
  let game: Game;
  let card: PrivateSecurity;
  let player: TestPlayer;
  let opponent1: TestPlayer;
  let opponent2: TestPlayer;

  beforeEach(function() {
    card = new PrivateSecurity();
    player = TestPlayers.BLUE.newPlayer();
    opponent1 = TestPlayers.RED.newPlayer();
    opponent2 = TestPlayers.GREEN.newPlayer();
    game = Game.newInstance('id', [player, opponent1, opponent2], player);
  });

  it('protects against Hired Raiders', function() {
    opponent1.steel = 5;
    opponent2.steel = 5;
    opponent1.megaCredits = 5;
    opponent2.megaCredits = 5;

    const hiredRaiders = new HiredRaiders();

    opponent2.playedCards = [];
    let action = hiredRaiders.play(player) as OrOptions;
    // Options for both opponents.
    expect(action.options).has.lengthOf(5);

    // Opponent 2 has Private Security
    opponent2.playedCards = [card];
    action = hiredRaiders.play(player) as OrOptions;
    // Options for only one opponent.
    expect(action.options).has.lengthOf(4);
    const filtered = action.options.filter((option) => option.title.toString().includes('M€'));
    expect(filtered).has.lengthOf(1);
    filtered[0].cb();
    // And it's the one without Private Security.
    expect(opponent1.megaCredits).to.eq(2);
  });
});
