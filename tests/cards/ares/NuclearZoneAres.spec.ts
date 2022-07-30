import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/common/TileType';
import {NuclearZoneAres} from '../../../src/cards/ares/NuclearZoneAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';

describe('NuclearZoneAres', function() {
  it('Should play', function() {
    const card = new NuclearZoneAres();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    const game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    const action = card.play(player);
    if (action !== undefined) {
      const space = action.availableSpaces[0];
      action.cb(space);
      expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
      expect(card.getVictoryPoints()).to.eq(-2);
      expect(space.adjacency).deep.eq({bonus: [], cost: 2});
    }
    expect(game.getTemperature()).to.eq(-26);
  });
});
