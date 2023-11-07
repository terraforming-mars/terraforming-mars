import {expect} from 'chai';
import {CarbonateProcessing} from '../../../src/server/cards/base/CarbonateProcessing';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('CarbonateProcessing', function() {
  let card: CarbonateProcessing;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CarbonateProcessing();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.heat).to.eq(3);
  });
});
