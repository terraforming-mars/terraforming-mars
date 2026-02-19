import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {IPlayer} from '../../../src/server/IPlayer';
import {runAllActions} from '../../TestingUtils';
import {CosmicRadiation} from '../../../src/server/cards/moon/CosmicRadiation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

describe('CosmicRadiation', () => {
  it('can play', () => {
    const [game, player1] = testGame(3, {moonExpansion: true});
    const card = new CosmicRadiation();
    const moonData = MoonExpansion.moonData(game);

    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    moonData.miningRate = 4;
    expect(player1.getPlayableCards()).does.include(card);

    moonData.miningRate = 3;
    expect(player1.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    const [game, player1, player2, player3] = testGame(3, {moonExpansion: true});
    const card = new CosmicRadiation();
    const moonData = MoonExpansion.moonData(game);

    const spaces = moonData.moon.getAvailableSpacesOnLand(player1);

    const assignTile = function(idx: number, player: IPlayer) {
      spaces[idx].tile = {tileType: TileType.MOON_MINE};
      spaces[idx].player = player;
    };

    assignTile(0, player1);
    player1.megaCredits = 10;

    assignTile(1, player2);
    assignTile(2, player2);
    player2.megaCredits = 3;

    assignTile(3, player3);
    assignTile(4, player3);
    assignTile(5, player3);
    player3.megaCredits = 20;

    card.play(player1);
    runAllActions(game);

    expect(player1.megaCredits).eq(6);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(8);
  });

  it('Compatible with underworld', () => {
    const [game, player1, player2] = testGame(2, {moonExpansion: true, underworldExpansion: true});
    const card = new CosmicRadiation();
    const moonData = MoonExpansion.moonData(game);

    const spaces = moonData.moon.getAvailableSpacesOnLand(player1);

    const assignTile = function(idx: number, player: IPlayer) {
      spaces[idx].tile = {tileType: TileType.MOON_MINE};
      spaces[idx].player = player;
    };

    assignTile(2, player2);
    player2.megaCredits = 3;
    player2.underworldData.corruption = 1;

    card.play(player1);
    runAllActions(game);

    assertIsMaybeBlock(player2, player2.popWaitingFor(), 'corruption');
    player2.megaCredits = 3;
    player1.underworldData.corruption = 0;
  });
});

