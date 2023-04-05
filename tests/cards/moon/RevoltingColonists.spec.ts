import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {RevoltingColonists} from '../../../src/server/cards/moon/RevoltingColonists';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

describe('RevoltingColonists', () => {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: RevoltingColonists;
  let moonData: IMoonData;

  beforeEach(() => {
    player1 = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player3 = TestPlayer.YELLOW.newPlayer();
    const game = Game.newInstance('gameid', [player1, player2, player3], player1, testGameOptions({moonExpansion: true}));
    card = new RevoltingColonists();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    moonData.colonyRate = 4;
    expect(player1.getPlayableCards()).does.include(card);

    moonData.colonyRate = 3;
    expect(player1.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player1);

    const assignTile = function(idx: number, player: Player) {
      spaces[idx].tile = {tileType: TileType.MOON_HABITAT};
      spaces[idx].player = player;
    };

    assignTile(0, player1);
    player1.megaCredits = 10;

    assignTile(1, player2);
    assignTile(2, player2);
    player2.megaCredits = 2;

    assignTile(3, player3);
    assignTile(4, player3);
    assignTile(5, player3);
    player3.megaCredits = 20;

    card.play(player1);
    runAllActions(player1.game);

    expect(player1.megaCredits).eq(7);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(11);
  });
});

