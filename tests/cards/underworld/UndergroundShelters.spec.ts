import {expect} from 'chai';
import {UndergroundShelters} from '../../../src/server/cards/underworld/UndergroundShelters';
import {testGame} from '../../TestGame';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

describe('UndergroundShelters', () => {
  it('Should play', () => {
    const card = new UndergroundShelters();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('VPs', () => {
    // Spaces 31 and 35 have 6 spaces around them, none of which intersect.
    const card = new UndergroundShelters();
    const [game, player] = testGame(2, {underworldExpansion: true});
    const board = game.board;

    expect(card.getVictoryPoints(player)).eq(0);
    const city1 = board.getSpaceOrThrow('31');
    addCity(player, city1.id);
    const adjacent1 = board.getAdjacentSpaces(city1);

    adjacent1[0].excavator = player;
    expect(card.getVictoryPoints(player)).eq(0);
    adjacent1[1].excavator = player;
    expect(card.getVictoryPoints(player)).eq(0);
    adjacent1[2].excavator = player;
    expect(card.getVictoryPoints(player)).eq(1);
    adjacent1[3].excavator = player;
    expect(card.getVictoryPoints(player)).eq(1);
    adjacent1[4].excavator = player;
    expect(card.getVictoryPoints(player)).eq(1);
    adjacent1[5].excavator = player;
    expect(card.getVictoryPoints(player)).eq(2);

    const city2 = board.getSpaceOrThrow('35');
    addCity(player, city2.id);
    const adjacent2 = board.getAdjacentSpaces(city2);

    city2.excavator = player;
    expect(card.getVictoryPoints(player)).eq(2);
    adjacent2[0].excavator = player;
    expect(card.getVictoryPoints(player)).eq(2);
    adjacent2[1].excavator = player;
    expect(card.getVictoryPoints(player)).eq(3);

    // If necessary, add more cases where excavators are other players, and also where excavation spaces
    // are not next to cities.
  });
});
