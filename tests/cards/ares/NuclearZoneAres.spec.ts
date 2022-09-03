import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {NuclearZoneAres} from '../../../src/server/cards/ares/NuclearZoneAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';

describe('NuclearZoneAres', function() {
  it('Should play', function() {
    const card = new NuclearZoneAres();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    const game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints()).to.eq(-2);
    expect(space.adjacency).deep.eq({bonus: [], cost: 2});
    expect(game.getTemperature()).to.eq(-26);
  });
});
