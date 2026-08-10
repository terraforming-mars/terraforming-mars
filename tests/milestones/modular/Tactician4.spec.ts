import {expect} from 'chai';
import {Tactician4} from '../../../src/server/milestones/modular/Tactician4';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';

describe('Tactician4', () => {
  const milestone = new Tactician4();

  it('Can claim with 4 cards with requirements', () => {
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 3; i++) {
      player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot qualifies with 30 M€', () => {
    expect(milestone.marsBotCanClaim({mcSupply: 29} as unknown as IMarsBot)).is.false;
    expect(milestone.marsBotCanClaim({mcSupply: 30} as unknown as IMarsBot)).is.true;
  });
});
