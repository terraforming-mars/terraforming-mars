import {expect} from 'chai';
import {EccentricSponsor} from '../../../src/cards/prelude/EccentricSponsor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('EccentricSponsor', function() {
  let card : EccentricSponsor; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EccentricSponsor();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Gets card discount', function() {
    expect(card.getCardDiscount(player, game)).to.eq(0);
    player.lastCardPlayed = card;
    expect(card.getCardDiscount(player, game)).to.eq(25);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
