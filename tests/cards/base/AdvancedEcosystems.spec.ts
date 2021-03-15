import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {Player} from '../../../src/Player';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {TundraFarming} from '../../../src/cards/base/TundraFarming';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/cards/prelude/ResearchNetwork';
import {TestPlayers} from '../../TestPlayers';

describe('AdvancedEcosystems', function() {
  let card : AdvancedEcosystems; let player : Player;

  beforeEach(function() {
    card = new AdvancedEcosystems();
    player = TestPlayers.BLUE.newPlayer();
    player.playedCards.push(new TundraFarming(), new ResearchNetwork());
  });

  it('Can\'t play if tag requirements is unmet', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.not.true;

    player.playedCards.push(new Tardigrades());
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
  });

  it('Can play with two wildcards', function() {
    player.playedCards.push(new ResearchCoordination());
    expect(card.canPlay(player)).is.true;
  });
});
