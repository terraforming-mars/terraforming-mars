import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {LunarMining} from '../../../src/server/cards/colonies/LunarMining';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {cast, testGame} from '../../TestingUtils';

describe('LunarMining', () => {
  it('Should play', () => {
    const card = new LunarMining();
    const card2 = new SpaceHotels();
    const card3 = new LunaGovernor();
    const [/* game*/, player] = testGame(1);
    player.playedCards.push(card2, card3);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(2);
  });
});
