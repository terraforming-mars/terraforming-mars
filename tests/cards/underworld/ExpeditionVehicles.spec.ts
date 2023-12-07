import {expect} from 'chai';
import {ExpeditionVehicles} from '../../../src/server/cards/underworld/ExpeditionVehicles';
import {testGame} from '../../TestGame';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {TileType} from '../../../src/common/TileType';

describe('ExpeditionVehicles', () => {
  const playRuns = [
    {cities: 0, excavations: 0},
    {cities: 1, excavations: 0},
    {cities: 2, excavations: 0},
    {cities: 3, excavations: 1},
    {cities: 4, excavations: 1},
    {cities: 5, excavations: 1},
    {cities: 6, excavations: 2},
    {cities: 7, excavations: 2},
    {cities: 8, excavations: 2},
    {cities: 9, excavations: 3},
  ] as const;
  for (const run of playRuns) {
    it('play ' + run.cities, () => {
      const card = new ExpeditionVehicles();
      const [game, player] = testGame(2, {underworldExpansion: true});

      for (let idx = 0; idx < run.cities; idx++) {
        addCity(player);
      }
      cast(card.play(player), undefined);
      runAllActions(game);

      for (let idx = 0; idx < run.excavations; idx++) {
        UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
        runAllActions(game);
      }
      cast(player.popWaitingFor(), undefined);
    });
  }

  const onTilePlacedRuns = [
    {idx: 0, self: false, isolated: true, expected: {cardsInHand: 0}},
    {idx: 1, self: false, isolated: false, expected: {cardsInHand: 0}},
    {idx: 2, self: true, isolated: true, expected: {cardsInHand: 1}},
    {idx: 3, self: true, isolated: false, expected: {cardsInHand: 0}},
  ] as const;
  for (const run of onTilePlacedRuns) {
    it('onTilePlaced ' + run.idx, () => {
      const card = new ExpeditionVehicles();
      const [game, player, player2] = testGame(2, {underworldExpansion: true});

      const spaces = game.board.getAvailableSpacesOnLand(player);
      const neighbor = spaces[0];
      const space = game.board.getAdjacentSpaces(neighbor)[0];

      if (run.isolated === false) {
        game.simpleAddTile(player2, neighbor, {tileType: TileType.BIOFERTILIZER_FACILITY});
      }

      player.playedCards.push(card);

      addCity(run.self ? player : player2, space.id);
      expect(player.cardsInHand).has.length(run.expected.cardsInHand);
    });
  }
});
