import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {NuclearZoneAres} from '../../../src/server/cards/ares/NuclearZoneAres';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('NuclearZoneAres', () => {
  it('Should play', () => {
    const card = new NuclearZoneAres();
    const [game, player] = testGame(2, {aresExtension: true});
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints(player)).to.eq(-2);
    expect(space.adjacency).deep.eq({bonus: [], cost: 2});
    expect(game.getTemperature()).to.eq(-26);
  });
});
