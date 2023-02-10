import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {runAllActions, cast} from '../../TestingUtils';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';

import {Quill} from '../../../src/server/cards/ceos/Quill';


describe('Quill', function() {
  let card: Quill;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Quill();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    const dirigibles = new Dirigibles();
    const localShading = new LocalShading();
    player.playedCards.push(dirigibles, localShading);

    // Sanity
    expect(dirigibles.resourceCount).eq(0);
    expect(localShading.resourceCount).eq(0);
    expect(dirigibles.resourceCount).eq(0);

    card.action(player);
    expect(dirigibles.resourceCount).eq(2);
    expect(localShading.resourceCount).eq(2);
    expect(game.deferredActions).has.length(1);

    runAllActions(game);
    const addFloaters = cast(player.popWaitingFor(), SelectCard<ICard>);
    addFloaters.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(4);
  });
});
