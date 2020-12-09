import {expect} from 'chai';
import {Omnicourt} from '../../../src/cards/venusNext/Omnicourt';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('Omnicourt', function() {
  it('Should play', function() {
    const card = new Omnicourt();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    expect(card.canPlay(player, game)).is.not.true;
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(22);
  });
});
