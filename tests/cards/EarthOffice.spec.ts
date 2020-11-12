import {expect} from 'chai';
import {EarthOffice} from '../../src/cards/EarthOffice';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Birds} from '../../src/cards/Birds';
import {LunaGovernor} from '../../src/cards/colonies/LunaGovernor';

describe('EarthOffice', function() {
  let card : EarthOffice; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EarthOffice();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should play', function() {
    expect(card.getCardDiscount(player, game, card)).to.eq(3);
    expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, game, new LunaGovernor())).to.eq(6);
  });
});

