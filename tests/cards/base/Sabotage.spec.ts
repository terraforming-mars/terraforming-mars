import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Sabotage} from '../../../src/server/cards/base/Sabotage';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Sabotage', function() {
  let card: Sabotage;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    card = new Sabotage();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.titanium = 3;
    player2.steel = 4;
    player2.megaCredits = 7;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(4);

    action.options[0].cb();
    expect(player2.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.megaCredits).to.eq(0);
  });
});
