import {expect} from 'chai';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {TectonicStressPower} from '../../../src/cards/base/TectonicStressPower';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TectonicStressPower', function() {
  let card : TectonicStressPower; let player : TestPlayer;

  beforeEach(function() {
    card = new TectonicStressPower();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new SearchForLife(), new SearchForLife());
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
