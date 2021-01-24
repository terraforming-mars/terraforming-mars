import {expect} from 'chai';
import {SpaceMirrors} from '../../../src/cards/base/SpaceMirrors';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import * as utils from '../../TestingUtils';

describe('SpaceMirrors', function() {
  let card : SpaceMirrors; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SpaceMirrors();
    player = utils.TestPlayers.BLUE.newPlayer();
    const redPlayer = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    player.megaCredits = 6;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.megaCredits = 7;
    expect(card.canAct(player)).is.true;

    card.action(player);
    utils.runNextAction(game);
    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
