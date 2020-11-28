import {expect} from 'chai';
import {PowerInfrastructure} from '../../../src/cards/base/PowerInfrastructure';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('PowerInfrastructure', function() {
  let card : PowerInfrastructure; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PowerInfrastructure();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t act', function() {
    card.play(player, game);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    const action = card.action(player, game);
    action.cb(1);

    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
