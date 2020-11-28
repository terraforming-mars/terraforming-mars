import {expect} from 'chai';
import {Teractor} from '../../../src/cards/corporation/Teractor';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Cartel} from '../../../src/cards/base/Cartel';
import {Birds} from '../../../src/cards/base/Birds';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';

describe('Teractor', function() {
  let card : Teractor; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Teractor();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);

    const action = card.play();
    expect(action).is.undefined;
  });


  it('Should play', function() {
    expect(card.getCardDiscount(player, game, new Cartel())).to.eq(3);
    expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, game, new LunaGovernor())).to.eq(6);
  });
});
