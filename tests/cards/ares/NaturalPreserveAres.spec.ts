import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {NaturalPreserveAres} from '../../../src/server/cards/ares/NaturalPreserveAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('NaturalPreserveAres', () => {
  let card: NaturalPreserveAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NaturalPreserveAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS]});
  });
});
