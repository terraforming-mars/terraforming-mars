import {TestPlayer} from '../../TestPlayer';
import {TheGrandLunaCapitalGroup} from '../../../src/server/cards/moon/TheGrandLunaCapitalGroup';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {testGame} from '../../TestGame';

describe('TheGrandLunaCapitalGroup', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let card: TheGrandLunaCapitalGroup;
  let moonData: MoonData;

  beforeEach(() => {
    [/* game */, player, otherPlayer] = testGame(2, {moonExpansion: true});
    card = new TheGrandLunaCapitalGroup();
    moonData = MoonExpansion.moonData(player.game);
  });

  it('effect', () => {
    const centerSpace = moonData.moon.getSpaceOrThrow('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(player, adjacentSpaces[1].id);
    MoonExpansion.addHabitatTile(player, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(player, adjacentSpaces[3].id);
    MoonExpansion.addHabitatTile(player, adjacentSpaces[4].id);

    // Test 1: place non-colony
    player.megaCredits = 0;
    player.corporations.push(card);
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(player.megaCredits).eq(0);

    // Test 2: Do it again, now add a colony.
    centerSpace.tile = undefined;
    centerSpace.player = undefined;
    player.megaCredits = 0;
    // Trigger the effect.
    MoonExpansion.addHabitatTile(player, centerSpace.id);
    expect(player.megaCredits).eq(4);
  });

  it('victoryPoints', () => {
    // It's possible better tests are necessary, but I don't think so.
    // I was wrong.
    const centerSpace = moonData.moon.getSpaceOrThrow('m06');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    expect(card.getVictoryPoints(player)).eq(0);

    MoonExpansion.addHabitatTile(player, centerSpace.id);
    expect(card.getVictoryPoints(player)).eq(0);

    MoonExpansion.addHabitatTile(otherPlayer, adjacentSpaces[0].id);
    expect(card.getVictoryPoints(player)).eq(1);

    adjacentSpaces[0].tile = undefined;
    adjacentSpaces[0].player = undefined;
    MoonExpansion.addHabitatTile(player, adjacentSpaces[0].id);
    expect(card.getVictoryPoints(player)).eq(2);

    MoonExpansion.addHabitatTile(otherPlayer, adjacentSpaces[1].id);
    expect(card.getVictoryPoints(player)).eq(3);
  });
});

