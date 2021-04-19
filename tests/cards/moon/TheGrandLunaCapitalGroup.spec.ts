import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TheGrandLunaCapitalGroup} from '../../../src/cards/moon/TheGrandLunaCapitalGroup';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TheGrandLunaCapitalGroup', () => {
  let player: Player;
  let otherPlayer: Player;
  let card: TheGrandLunaCapitalGroup;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('id', [player, otherPlayer], player, MOON_OPTIONS);
    card = new TheGrandLunaCapitalGroup();
    moonData = MoonExpansion.moonData(game);
  });

  it('effect', () => {
    const centerSpace = moonData.moon.getSpace('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(player, adjacentSpaces[1].id);
    MoonExpansion.addColonyTile(player, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(player, adjacentSpaces[3].id);
    MoonExpansion.addColonyTile(player, adjacentSpaces[4].id);

    // Test 1: place non-colony
    player.megaCredits = 0;
    player.corporationCard = card;
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(player.megaCredits).eq(0);

    // Test 2: Do it again, now add a colony.
    centerSpace.tile = undefined;
    centerSpace.player = undefined;
    player.megaCredits = 0;
    player.corporationCard = card;
    // Trigger the effect.
    MoonExpansion.addColonyTile(player, centerSpace.id);
    expect(player.megaCredits).eq(4);
  });

  it('victoryPoints', () => {
    // It's possible better tests are necessary, but I don't think so.
    // I was wrong.
    const centerSpace = moonData.moon.getSpace('m06');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    expect(card.getVictoryPoints(player)).eq(0);

    MoonExpansion.addColonyTile(player, centerSpace.id);
    expect(card.getVictoryPoints(player)).eq(0);

    MoonExpansion.addColonyTile(otherPlayer, adjacentSpaces[0].id);
    expect(card.getVictoryPoints(player)).eq(1);

    adjacentSpaces[0].tile = undefined;
    adjacentSpaces[0].player = undefined;
    MoonExpansion.addColonyTile(player, adjacentSpaces[0].id);
    expect(card.getVictoryPoints(player)).eq(2);

    MoonExpansion.addColonyTile(otherPlayer, adjacentSpaces[1].id);
    expect(card.getVictoryPoints(player)).eq(3);
  });
});

