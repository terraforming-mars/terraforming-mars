import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {AZoologist} from '@/server/awards/amazonisPlanitia/AZoologist';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';
import {CardResource} from '@/common/CardResource';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';

describe('AZoologist', () => {
  it('scores a player by animal and microbe resources', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const animals = fakeCard({resourceType: CardResource.ANIMAL});
    animals.resourceCount = 3;
    const floaters = fakeCard({resourceType: CardResource.FLOATER});
    floaters.resourceCount = 2;
    player.playedCards.push(animals, floaters);

    expect(new AZoologist().getScore(player)).to.eq(3);
  });

  it('MarsBot scores its Bio track plus 5', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.PLANT, 3);

    expect(new AZoologist().marsBotScore(marsBot)).eq(8);
  });
});
