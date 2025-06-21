import {expect} from 'chai';
import {Ingrid} from '../../../src/server/cards/ceos/Ingrid';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {addGreenery, addOcean, addCity, forceGenerationEnd, cast, runAllActions} from '../../TestingUtils';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {EcologicalZoneAres} from '../../../src/server/cards/ares/EcologicalZoneAres';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('Ingrid', () => {
  let card: Ingrid;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ingrid();
    [game, player] = testGame(2, {preludeExtension: true});
    player.playedCards.push(card);
  });

  it('Draws a card when taking action to place tile on Mars', () => {
    card.action();
    addGreenery(player);
    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(1);
  });

  it('Draws a card when placing Ecological Zone Ares', () => {
    // Place ecozone requirement before activating Ingrid
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);
    expect(player.cardsInHand).has.length(0); // Sanity
    card.action();

    const ecozone = new EcologicalZoneAres();
    cast(ecozone.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const adjacentSpace = selectSpace.spaces[0];
    selectSpace.cb(adjacentSpace);

    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);
    expect(player.cardsInHand).has.length(1);
  });

  it('Draws a card when placing an Ocean on Mars', () => {
    card.action();
    addOcean(player);
    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(1);
  });

  it('Does not trigger ability when placing ocean during WGT (Solar)', () => {
    card.action();
    game.phase = Phase.SOLAR;
    addOcean(player);

    expect(game.deferredActions).has.length(0);
  });

  it('Does not trigger ability when placing tile off Mars', () => {
    card.action();
    addCity(player, SpaceName.GANYMEDE_COLONY);
    expect(game.deferredActions).has.length(0);
  });

  it('Can only act once per game', () => {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
