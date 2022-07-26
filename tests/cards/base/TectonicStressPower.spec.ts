import {expect} from 'chai';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {TectonicStressPower} from '../../../src/cards/base/TectonicStressPower';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('TectonicStressPower', function() {
  let card: TectonicStressPower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new TectonicStressPower();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new SearchForLife(), new SearchForLife());
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
