import {expect} from 'chai';
import {KingdomofTauraro} from '../../../src/server/cards/underworld/KingdomofTauraro';
import {testGame} from '../../TestGame';
import {addCity, addGreenery, runAllActions} from '../../TestingUtils';
import {assertPlaceCity} from '../../assertions';

describe('KingdomofTauraro', () => {
  it('Should play', () => {
    const card = new KingdomofTauraro();
    const [game, player, player2] = testGame(2);

    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.production.megacredits).eq(6);
    expect(player2.production.megacredits).eq(2);
  });

  it('First action', () => {
    const card = new KingdomofTauraro();
    const [game, player] = testGame(2);

    player.deferInitialAction(card);
    runAllActions(game);
    assertPlaceCity(player, player.popWaitingFor());
  });

  it('May place next to own cities', () => {
    const card = new KingdomofTauraro();
    const [game, player] = testGame(2);
    player.corporations.push(card);

    const board = game.board;
    const space = board.getSpaceOrThrow('35');
    addCity(player, space.id);
    const availableSpacesForCity = board.getAvailableSpacesForCity(player);
    const spacesNextToCity = board.getAdjacentSpaces(space);
    expect(availableSpacesForCity).includes(spacesNextToCity[0]);
  });

  it('Must place next to own tiles', () => {
    const card = new KingdomofTauraro();
    const [game, player, player2] = testGame(2);
    player.corporations.push(card);

    const board = game.board;
    // Spot 55 has 6 land spaces next to it. Makes testing easier.
    const space = board.getSpaceOrThrow('55');
    const otherSpace = board.getSpaceOrThrow('35');
    addGreenery(player, space.id);
    const availableSpacesForCity = board.getAvailableSpacesForCity(player);
    expect(availableSpacesForCity).to.have.members(board.getAdjacentSpaces(space));
    expect(availableSpacesForCity).does.not.include(otherSpace);

    // If all spaces are taken, available spaces are broader
    for (const space of availableSpacesForCity) {
      addGreenery(player2, space.id);
    }

    expect(board.getAvailableSpacesForCity(player)).does.includes(otherSpace);
  });
});
