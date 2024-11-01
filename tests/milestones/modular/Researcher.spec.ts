import {expect} from 'chai';
import {Researcher} from '../../../src/server/milestones/modular/Researcher';
import {TestPlayer} from '../../TestPlayer';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';

describe('Researcher', () => {
  let milestone: Researcher;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Researcher();
    [/* game */, player] = testGame(2);
  });

  it('Standard test', () => {
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {science: 3};
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {science: 4};
    expect(milestone.canClaim(player)).is.true;

    // Wild tag counts.
    player.tagsForTest = {science: 3, wild: 1};
    expect(milestone.canClaim(player)).is.true;
  });

  it('Chimera Corp scenario', () => {
    player.corporations.push(new Chimera());
    player.playedCards = [];
    expect(milestone.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE]}));
    expect(milestone.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE]}));
    expect(milestone.getScore(player)).eq(3);

    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.not.true;

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.true;
  });
});
