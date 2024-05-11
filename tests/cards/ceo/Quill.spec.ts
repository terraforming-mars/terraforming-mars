import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions, cast} from '../../TestingUtils';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {Quill} from '../../../src/server/cards/ceos/Quill';

describe('Quill', function() {
  let card: Quill;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Quill();
    [game, player] = testGame(1);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Cannot act if no Floaters are in play', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    const dirigibles = new Dirigibles();
    const localShading = new LocalShading();
    player.playedCards.push(dirigibles, localShading);
    player.megaCredits = 0;

    // Sanity
    expect(dirigibles.resourceCount).eq(0);
    expect(localShading.resourceCount).eq(0);

    card.action(player);
    expect(dirigibles.resourceCount).eq(2);
    expect(localShading.resourceCount).eq(2);
    expect(game.deferredActions).has.length(2);

    runAllActions(game);
    const addFloaters = cast(player.popWaitingFor(), SelectCard<ICard>);
    addFloaters.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(4);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
  });
});
