import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CarbonNanosystems} from '../../../src/server/cards/promo/CarbonNanosystems';
import {cast} from '../../TestingUtils';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {Research} from '../../../src/server/cards/base/Research';
import {TerralabsResearch} from '../../../src/server/cards/turmoil/TerralabsResearch';

describe('CarbonNanosystems', () => {
  it('play', () => {
    const card = new CarbonNanosystems();
    const [/* game */, player] = testGame(1);
    cast(player.playCard(card), undefined);
    expect(card.resourceCount).eq(1);
  });

  it('Effect: play a science tag', () => {
    const card = new CarbonNanosystems();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(card);

    // No science tags
    player.playCard(new MicroMills());
    expect(card.resourceCount).eq(0);

    // 1 science tag
    player.playCard(new AICentral());
    expect(card.resourceCount).eq(1);

    // 2 science tags
    player.playCard(new Research());
    expect(card.resourceCount).eq(3);

    // Corp with a science tag
    player.playCorporationCard(new TerralabsResearch());
    expect(card.resourceCount).eq(4);
  });
});
