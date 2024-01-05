import {expect} from 'chai';
import {ExpeditionVehicles} from '../../../src/server/cards/underworld/ExpeditionVehicles';
import {testGame} from '../../TestGame';
import {addCity} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';

describe('ExpeditionVehicles', () => {
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
