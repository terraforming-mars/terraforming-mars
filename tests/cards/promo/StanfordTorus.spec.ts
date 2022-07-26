import {expect} from 'chai';
import {StanfordTorus} from '../../../src/cards/promo/StanfordTorus';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('StanfordTorus', function() {
  let card: StanfordTorus;
  let player: Player;

  beforeEach(function() {
    card = new StanfordTorus();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.game.getCitiesCount()).to.eq(1);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
