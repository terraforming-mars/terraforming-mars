import {expect} from 'chai';
import {RadChemFactory} from '../../../src/server/cards/base/RadChemFactory';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('RadChemFactory', function() {
  let card: RadChemFactory;
  let player: Player;

  beforeEach(function() {
    card = new RadChemFactory();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.simplePlay(card);
    expect(player.production.energy).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
