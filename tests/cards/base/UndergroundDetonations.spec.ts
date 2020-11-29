import {expect} from 'chai';
import {UndergroundDetonations} from '../../../src/cards/base/UndergroundDetonations';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('UndergroundDetonations', function() {
  let card : UndergroundDetonations; let player : Player; let game : Game;

  beforeEach(function() {
    card = new UndergroundDetonations();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t act', function() {
    player.megaCredits = 9;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.megaCredits = 10;
    expect(card.canAct(player)).is.true;

    card.action(player, game);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
