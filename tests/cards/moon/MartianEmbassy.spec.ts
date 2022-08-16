import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MartianEmbassy} from '../../../src/server/cards/moon/MartianEmbassy';

describe('MartianEmbassy', () => {
  let player: TestPlayer;
  let card: MartianEmbassy;
  let game: Game;

  beforeEach(() => {
    game = newTestGame(1, {pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    card = new MartianEmbassy();
  });

  it('play', () => {
    player.tagsForTest = {moon: 1};
    game.pathfindersData!.mars = 0;

    card.play(player);

    expect(game.pathfindersData!.mars).eq(0);

    game.pathfindersData!.mars = 0;
    player.tagsForTest = {moon: 2};

    card.play(player);

    expect(game.pathfindersData!.mars).eq(1);

    game.pathfindersData!.mars = 0;
    player.tagsForTest = {moon: 4};

    card.play(player);

    expect(game.pathfindersData!.mars).eq(1);

    game.pathfindersData!.mars = 0;
    player.tagsForTest = {moon: 5};

    card.play(player);

    expect(game.pathfindersData!.mars).eq(2);
  });
});

