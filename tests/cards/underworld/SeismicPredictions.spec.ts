import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SeismicPredictions} from '../../../src/server/cards/underworld/SeismicPredictions';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('SeismicPredictions', function() {
  let card: SeismicPredictions;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new SeismicPredictions();
    [game, player] = testGame(2, {turmoilExtension: true, underworldExpansion: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {mc: 10, ownedTiles: 0, claimed: 0, influence: 0, expect: {mc: 10}},
    {mc: 10, ownedTiles: 0, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, ownedTiles: 1, claimed: 1, influence: 0, expect: {mc: 10}},
    {mc: 10, ownedTiles: 1, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, ownedTiles: 0, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, ownedTiles: 4, claimed: 3, influence: 0, expect: {mc: 8}},
    {mc: 10, ownedTiles: 4, claimed: 0, influence: 0, expect: {mc: 2}},
    {mc: 10, ownedTiles: 6, claimed: 0, influence: 0, expect: {mc: 0}},
    {mc: 10, ownedTiles: 6, claimed: 0, influence: 1, expect: {mc: 2}},
    {mc: 10, ownedTiles: 6, claimed: 0, influence: 2, expect: {mc: 4}},
    {mc: 10, ownedTiles: 6, claimed: 0, influence: 3, expect: {mc: 6}},
  ] as const;

  resolveTests.forEach((run, idx) => {
    it(idx.toString() + ': ' + JSON.stringify(run), () => {
      if (run.ownedTiles < run.claimed) {
        throw new Error('Invalid test');
      }
      player.megaCredits = run.mc;
      turmoil.addInfluenceBonus(player, run.influence);

      const board = game.board;
      const spaces = [...board.getAvailableSpacesOnLand(player)].slice(0, run.ownedTiles);
      spaces.forEach((space, idx) => {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
        space.player = player;
        UnderworldExpansion.identify(game, space, player);
        if (idx < run.claimed) {
          space.excavator = player;
        }
      });

      card.resolve(game, turmoil);

      expect(player.megaCredits).eq(run.expect.mc);

      // Expect the unclaimed tokens
      // Count the tokens in the pile
    });
  });
});
