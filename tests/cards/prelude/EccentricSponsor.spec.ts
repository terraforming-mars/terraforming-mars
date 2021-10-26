import {expect} from 'chai';
import {EccentricSponsor} from '../../../src/cards/prelude/EccentricSponsor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('EccentricSponsor', function() {
  let card : EccentricSponsor; let player : Player;

  beforeEach(function() {
    card = new EccentricSponsor();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Gets card discount', function() {
    expect(card.getCardDiscount(player)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getCardDiscount(player)).to.eq(25);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
