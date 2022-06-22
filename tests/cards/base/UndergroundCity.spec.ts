import {expect} from 'chai';
import {UndergroundCity} from '../../../src/cards/base/UndergroundCity';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('UndergroundCity', function() {
  let card : UndergroundCity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new UndergroundCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(action).is.not.undefined;

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesCount()).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
