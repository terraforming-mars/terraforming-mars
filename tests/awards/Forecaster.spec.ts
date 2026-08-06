import {expect} from 'chai';
import {Forecaster} from '../../src/server/awards/Forecaster';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Forecaster', () => {
  const award = new Forecaster();

  it('scores a player by cards with requirements', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard());

    expect(award.getScore(player)).to.eq(1);
  });

  it('scores MarsBot by every 7 of its M€', () => {
    expect(award.marsBotScore({mcSupply: 13} as unknown as IMarsBot)).to.eq(1);
    expect(award.marsBotScore({mcSupply: 14} as unknown as IMarsBot)).to.eq(2);
  });
});
