import {expect} from 'chai';
import {Hackers} from '../../../src/cards/base/Hackers';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Hackers', function() {
  let card: Hackers;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Hackers();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
  });
});
