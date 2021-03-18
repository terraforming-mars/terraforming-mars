import {expect} from 'chai';
import {NuclearZone} from '../../../src/cards/base/NuclearZone';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('NuclearZone', function() {
  it('Should play', function() {
    const card = new NuclearZone();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    if (action !== undefined) {
      const space = action.availableSpaces[0];
      action.cb(space);
      expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
      player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
      expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
      expect(space.adjacency?.cost).eq(undefined);
    }
    expect(game.getTemperature()).to.eq(-26);
  });
});
