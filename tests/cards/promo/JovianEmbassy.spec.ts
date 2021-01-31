import {expect} from 'chai';
import {JovianEmbassy} from '../../../src/cards/promo/JovianEmbassy';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('JovianEmbassy', function() {
  it('Should play', function() {
    const card = new JovianEmbassy();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    Game.newInstance('foobar', [player, redPlayer], player);

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
