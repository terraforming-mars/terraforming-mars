import {expect} from 'chai';
import {NuclearZone} from '../../../src/server/cards/base/NuclearZone';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';

describe('NuclearZone', function() {
  it('Should play', function() {
    const card = new NuclearZone();
    const [game, player] = testGame(2);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints(player)).to.eq(-2);
    expect(space.adjacency?.cost).eq(undefined);
    expect(game.getTemperature()).to.eq(-26);
  });
});
