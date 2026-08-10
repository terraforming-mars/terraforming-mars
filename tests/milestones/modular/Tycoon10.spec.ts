import {expect} from 'chai';
import {Tycoon10} from '../../../src/server/milestones/modular/Tycoon10';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';

describe('Tycoon10', () => {
  const milestone = new Tycoon10();

  it('Can claim with 10 blue and green cards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    for (let i = 0; i < 9; i++) {
      player.playedCards.push(fakeCard());
    }
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(fakeCard());
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot counts its own played pile', () => {
    const pile: Array<IProjectCard> = [fakeCard({type: CardType.EVENT})];
    for (let i = 0; i < 9; i++) {
      pile.push(fakeCard());
    }
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;
    expect(milestone.marsBotCanClaim(bot)).is.false;

    pile.push(fakeCard());
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
