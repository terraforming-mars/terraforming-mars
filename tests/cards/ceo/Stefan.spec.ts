import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {Stefan} from '../../../src/server/cards/ceos/Stefan';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd, fakeCard, cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Stefan', function() {
  let card: Stefan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Stefan();
    [game, player] = testGame(1);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action, sells all cards', function() {
    const fake1 = fakeCard({tags: []});
    const fake2 = fakeCard({tags: []});
    player.cardsInHand.push(fake1, fake2);
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    game.deferredActions.runNext();
    selectCard.cb([fake1, fake2]);
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).eq(6);
  });

  it('Takes action, sells only 1 card', function() {
    const fake1 = fakeCard({tags: []});
    const fake2 = fakeCard({tags: []});
    player.cardsInHand.push(fake1, fake2);
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    game.deferredActions.runNext();
    selectCard.cb([fake1]);
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(1);
    expect(player.megaCredits).eq(3);
  });

  it('Can only act once per game', function() {
    const fake1 = fakeCard({tags: []});
    player.cardsInHand.push(fake1);

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    game.deferredActions.runNext();
    selectCard.cb([fake1]);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
