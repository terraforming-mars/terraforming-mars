import {expect} from 'chai';
import {SpaceHotels} from '../../../src/cards/prelude/SpaceHotels';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SpaceHotels', function() {
  let card : SpaceHotels; let player : Player;

  beforeEach(function() {
    card = new SpaceHotels();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    player.playedCards.push(card);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
