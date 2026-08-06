import {expect} from 'chai';
import {Tycoon} from '../../src/server/milestones/Tycoon';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {IProjectCard} from '../../src/server/cards/IProjectCard';

describe('Tycoon', () => {
  const milestone = new Tycoon();

  it('Can claim with 15 project cards, events aside', () => {
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 14; i++) {
      player.playedCards.push(fakeCard());
    }
    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard());
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot counts its own played pile', () => {
    const pile: Array<IProjectCard> = [];
    for (let i = 0; i < 14; i++) {
      pile.push(fakeCard());
    }
    pile.push(fakeCard({type: CardType.EVENT}));
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;
    expect(milestone.marsBotCanClaim(bot)).is.false;

    pile.push(fakeCard());
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
