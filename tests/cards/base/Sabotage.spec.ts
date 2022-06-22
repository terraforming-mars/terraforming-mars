import {expect} from 'chai';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Sabotage', function() {
  let card : Sabotage; let player : Player; let player2: Player;

  beforeEach(function() {
    card = new Sabotage();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.titanium = 3;
    player2.steel = 4;
    player2.megaCredits = 7;

    const action = card.play(player) as OrOptions;

    expect(action.options).has.lengthOf(4);

    action.options[0].cb();
    expect(player2.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.megaCredits).to.eq(0);
  });
});
