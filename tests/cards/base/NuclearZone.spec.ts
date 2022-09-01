import {expect} from 'chai';
import {NuclearZone} from '../../../src/server/cards/base/NuclearZone';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';

describe('NuclearZone', function() {
  it('Should play', function() {
    const card = new NuclearZone();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints()).to.eq(-2);
    expect(space.adjacency?.cost).eq(undefined);
    expect(game.getTemperature()).to.eq(-26);
  });
});
