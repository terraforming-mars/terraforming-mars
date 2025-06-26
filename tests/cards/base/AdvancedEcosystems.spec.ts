import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/server/cards/base/AdvancedEcosystems';
import {TestPlayer} from '../../TestPlayer';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {TundraFarming} from '../../../src/server/cards/base/TundraFarming';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';

describe('AdvancedEcosystems', () => {
  let card: AdvancedEcosystems;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AdvancedEcosystems();
    player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(new TundraFarming(), new ResearchNetwork());
  });

  it('Can not play if tag requirements is unmet', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.not.true;

    player.playedCards.push(new Tardigrades());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(3);
  });

  it('Can play with two wild tags', () => {
    player.playedCards.push(new ResearchCoordination());
    expect(card.canPlay(player)).is.true;
  });
});
