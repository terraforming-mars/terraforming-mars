import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {IPlayer} from '../../../src/server/IPlayer';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CosmicRadiation} from '../../../src/server/cards/moon/CosmicRadiation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';

describe('CosmicRadiation', () => {
  let game: IGame;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: CosmicRadiation;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player1, player2, player3] = testGame(3, {moonExpansion: true, turmoilExtension: true});
    card = new CosmicRadiation();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    moonData.miningRate = 4;
    expect(player1.getPlayableCardsForTest()).does.include(card);

    moonData.miningRate = 3;
    expect(player1.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
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
    runAllActions(player1.game);

    expect(player1.megaCredits).eq(6);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(8);
  });
});

