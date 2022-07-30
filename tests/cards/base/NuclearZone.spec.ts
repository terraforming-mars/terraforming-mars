import {expect} from 'chai';
import {NuclearZone} from '../../../src/cards/base/NuclearZone';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';

describe('NuclearZone', function() {
  it('Should play', function() {
    const card = new NuclearZone();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    if (action !== undefined) {
      const space = action.availableSpaces[0];
      action.cb(space);
      expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
      expect(card.getVictoryPoints()).to.eq(-2);
      expect(space.adjacency?.cost).eq(undefined);
    }
    expect(game.getTemperature()).to.eq(-26);
  });
});
