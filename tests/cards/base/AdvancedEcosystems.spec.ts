import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {TestPlayer} from '../../TestPlayer';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {TundraFarming} from '../../../src/cards/base/TundraFarming';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/cards/prelude/ResearchNetwork';
import {TestPlayers} from '../../TestPlayers';

describe('AdvancedEcosystems', function() {
  let card : AdvancedEcosystems; let player : TestPlayer;

  beforeEach(function() {
    card = new AdvancedEcosystems();
    player = TestPlayers.BLUE.newPlayer();
    player.playedCards.push(new TundraFarming(), new ResearchNetwork());
  });

  it('Can\'t play if tag requirements is unmet', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.playedCards.push(new Tardigrades());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
  });

  it('Can play with two wildcards', function() {
    player.playedCards.push(new ResearchCoordination());
    expect(player.canPlayIgnoringCost(card)).is.true;
  });
});
