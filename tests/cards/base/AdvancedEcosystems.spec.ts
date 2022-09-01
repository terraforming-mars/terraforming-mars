import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/server/cards/base/AdvancedEcosystems';
import {TestPlayer} from '../../TestPlayer';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {TundraFarming} from '../../../src/server/cards/base/TundraFarming';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';

describe('AdvancedEcosystems', function() {
  let card: AdvancedEcosystems;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AdvancedEcosystems();
    player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(new TundraFarming(), new ResearchNetwork());
  });

  it('Can not play if tag requirements is unmet', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.playedCards.push(new Tardigrades());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(3);
  });

  it('Can play with two wild tags', function() {
    player.playedCards.push(new ResearchCoordination());
    expect(player.canPlayIgnoringCost(card)).is.true;
  });
});
