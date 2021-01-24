import {expect} from 'chai';
import {AquiferTurbines} from '../../../src/cards/prelude/AquiferTurbines';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import * as utils from '../../TestingUtils';

describe('AquiferTurbines', function() {
  let card : AquiferTurbines; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AquiferTurbines();
    player = utils.TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can play', function() {
    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    player.megaCredits = 3;
    card.play(player, game);

    // PlaceOceanTile
    game.deferredActions.pop();

    // SelectHowToPayDeferred
    utils.runNextAction(game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});
