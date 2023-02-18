import {expect} from 'chai';
import {Ingrid} from '../../../src/server/cards/ceos/Ingrid';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {addGreenery, addOcean, addCityTile, forceGenerationEnd} from '../../TestingUtils';
import {SpaceName} from '../../../src/server/SpaceName';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Ingrid', function() {
  let card: Ingrid;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ingrid();
    game = newTestGame(2, {preludeExtension: true});
    player = getTestPlayer(game, 0);

    player.playedCards.push(card);
  });

  it('Draws a card when taking action to place tile on Mars', function() {
    card.action();
    addGreenery(player);
    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(1);
  });

  it('Does not trigger ability when placing ocean during WGT (Solar)', function() {
    card.action();
    game.phase = Phase.SOLAR;
    addOcean(player);

    expect(game.deferredActions).has.length(0);
  });

  it('Does not trigger ability when placing tile off Mars', function() {
    card.action();
    addCityTile(player, SpaceName.GANYMEDE_COLONY);
    expect(game.deferredActions).has.length(0);
  });

  it('Can only act once per game', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
