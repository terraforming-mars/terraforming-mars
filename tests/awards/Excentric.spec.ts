import {expect} from 'chai';
import {Excentric} from '../../src/server/awards/Excentric';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {CardResource} from '../../src/common/CardResource';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Excentric', () => {
  const award = new Excentric();

  it('scores a player by resources on cards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const card = fakeCard({resourceType: CardResource.MICROBE});
    card.resourceCount = 4;
    player.playedCards.push(card);

    expect(award.getScore(player)).to.eq(4);
  });

  it('scores MarsBot by every 5 of its M€', () => {
    expect(award.marsBotScore({mcSupply: 24} as unknown as IMarsBot)).to.eq(4);
    expect(award.marsBotScore({mcSupply: 25} as unknown as IMarsBot)).to.eq(5);
  });
});
