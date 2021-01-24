import {expect} from 'chai';
import {RestrictedArea} from '../../../src/cards/base/RestrictedArea';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import * as utils from '../../TestingUtils';

describe('RestrictedArea', function() {
  let card : RestrictedArea; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RestrictedArea();
    player = utils.TestPlayers.BLUE.newPlayer();
    const redPlayer = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act if not enough MC', function() {
    player.megaCredits = 1;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.not.undefined;

    const space = action.availableSpaces[0];

    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency?.bonus).eq(undefined);
  });

  it('Should act', function() {
    player.megaCredits = 2;
    expect(card.canAct(player)).is.true;
    card.action(player);

    utils.runNextAction(game);
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
