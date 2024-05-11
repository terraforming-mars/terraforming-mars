import {expect} from 'chai';
import {Ingrid} from '../../../src/server/cards/ceos/Ingrid';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {addGreenery, addOcean, addCity, forceGenerationEnd, cast} from '../../TestingUtils';
import {SpaceName} from '../../../src/server/SpaceName';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {EcologicalZoneAres} from '../../../src/server/cards/ares/EcologicalZoneAres';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('Ingrid', function() {
  let card: Ingrid;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ingrid();
    [game, player] = testGame(2, {preludeExtension: true});
    player.playedCards.push(card);
  });

  it('Draws a card when taking action to place tile on Mars', function() {
    card.action();
    addGreenery(player);
    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(1);
  });

  it('Draws a card when placing Ecological Zone Ares', function() {
    // Place ecozone requirement before activating Ingrid
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);
    expect(player.cardsInHand).has.length(0); // Sanity
    card.action();

    const ecozone = new EcologicalZoneAres();
    const action = cast(ecozone.play(player), SelectSpace);
    const adjacentSpace = action.spaces[0];
    action.cb(adjacentSpace);
    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    game.deferredActions.runNext(); // Draw card from Ingrid
    expect(player.cardsInHand).has.length(1);
  });

  it('Draws a card when placing an Ocean on Mars', function() {
    card.action();
    addOcean(player);
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
    addCity(player, SpaceName.GANYMEDE_COLONY);
    expect(game.deferredActions).has.length(0);
  });

  it('Can only act once per game', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
