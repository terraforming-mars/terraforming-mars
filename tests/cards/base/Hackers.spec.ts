import {expect} from 'chai';
import {Hackers} from '../../../src/cards/base/Hackers';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Hackers', function() {
  let card : Hackers; let player : Player;

  beforeEach(function() {
    card = new Hackers();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.true;
  });
});
