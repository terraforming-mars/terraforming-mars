import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {NuclearZoneAres} from '../../../src/cards/ares/NuclearZoneAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('NuclearZoneAres', function() {
  it('Should play', function() {
    const card = new NuclearZoneAres();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    const game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    const action = card.play(player);
    if (action !== undefined) {
      const space = action.availableSpaces[0];
      action.cb(space);
      expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
      player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
      expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
      expect(space.adjacency).deep.eq({bonus: [], cost: 2});
    }
    expect(game.getTemperature()).to.eq(-26);
  });
});
