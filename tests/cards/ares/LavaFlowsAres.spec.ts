import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LavaFlowsAres} from '../../../src/server/cards/ares/LavaFlowsAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('LavaFlowsAres', () => {
  let card: LavaFlowsAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new LavaFlowsAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    card.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
  });
});
