import {expect} from 'chai';
import {RegoPlastics} from '../../../src/server/cards/promo/RegoPlastics';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('RegoPlastics', function() {
  let card: RegoPlastics;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RegoPlastics();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getSteelValue()).to.eq(3);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
