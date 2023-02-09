import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TheGrandLunaCapitalGroup} from '../../../src/server/cards/moon/TheGrandLunaCapitalGroup';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('TheGrandLunaCapitalGroup', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let card: TheGrandLunaCapitalGroup;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, otherPlayer], player, testGameOptions({moonExpansion: true}));
    card = new TheGrandLunaCapitalGroup();
    moonData = MoonExpansion.moonData(game);
  });

  it('effect', () => {
    const centerSpace = moonData.moon.getSpace('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(player, adjacentSpaces[1].id);
    MoonExpansion.addHabitatTile(player, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(player, adjacentSpaces[3].id);
    MoonExpansion.addHabitatTile(player, adjacentSpaces[4].id);

    // Test 1: place non-colony
    player.megaCredits = 0;
    player.setCorporationForTest(card);
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
    const centerSpace = moonData.moon.getSpace('m06');
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

