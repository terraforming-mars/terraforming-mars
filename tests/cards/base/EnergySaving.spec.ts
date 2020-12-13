import {expect} from 'chai';
import {EnergySaving} from '../../../src/cards/base/EnergySaving';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EnergySaving', function() {
  it('Should play', function() {
    const card = new EnergySaving();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(action).is.undefined;
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addCityTile(player, landSpace.id);
    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
