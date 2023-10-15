import {expect} from 'chai';
import {Hackers} from '../../../src/server/cards/base/Hackers';
import {Resource} from '../../../src/common/Resource';
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
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
  });
});
