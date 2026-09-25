import {expect} from 'chai';
import {Agronomist} from '../../src/server/milestones/Agronomist';
import {TestPlayer} from '../TestPlayer';
import {Chimera} from '../../src/server/cards/pathfinders/Chimera';
import {fakeCard} from '../TestingUtils';
import {Tag} from '../../src/common/cards/Tag';
import {testGame} from '../TestGame';

describe('Agronomist', () => {
  let milestone: Agronomist;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Agronomist();
    [/* game */, player] = testGame(2);
  });

  it('Standard test', () => {
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {plant: 3};
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {plant: 4};
    expect(milestone.canClaim(player)).is.true;

    // Wild tag counts.
    player.tagsForTest = {plant: 3, wild: 1};
    expect(milestone.canClaim(player)).is.true;
  });

  it('Compatible with Chimera', () => {
    player.playedCards.push(new Chimera());
    expect(milestone.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.not.true;

    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.true;
  });
});
