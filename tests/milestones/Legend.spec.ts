import {expect} from 'chai';
import {Legend} from '../../src/server/milestones/Legend';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {IProjectCard} from '../../src/server/cards/IProjectCard';

describe('Legend', () => {
  const milestone = new Legend();

  it('Can claim with 5 played events', () => {
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 4; i++) {
      player.playedCards.push(fakeCard({type: CardType.EVENT}));
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot counts the events in its own played pile', () => {
    const pile: Array<IProjectCard> = [fakeCard()];
    for (let i = 0; i < 4; i++) {
      pile.push(fakeCard({type: CardType.EVENT}));
    }
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;
    expect(milestone.marsBotCanClaim(bot)).is.false;

    pile.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
