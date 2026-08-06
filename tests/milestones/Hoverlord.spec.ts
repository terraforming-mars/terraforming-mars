import {expect} from 'chai';
import {Hoverlord} from '../../src/server/milestones/Hoverlord';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {CardResource} from '../../src/common/CardResource';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Hoverlord', () => {
  const milestone = new Hoverlord();

  it('Can claim with 7 floaters on cards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const card = fakeCard({resourceType: CardResource.FLOATER});
    card.resourceCount = 6;
    player.playedCards.push(card);
    expect(milestone.canClaim(player)).is.false;

    card.resourceCount = 7;
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot counts the floaters on its Venus board', () => {
    expect(milestone.marsBotCanClaim({floaterCount: 6} as unknown as IMarsBot)).is.false;
    expect(milestone.marsBotCanClaim({floaterCount: 7} as unknown as IMarsBot)).is.true;
  });
});
