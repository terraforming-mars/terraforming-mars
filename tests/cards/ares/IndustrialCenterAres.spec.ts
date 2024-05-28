import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {IndustrialCenterAres} from '../../../src/server/cards/ares/IndustrialCenterAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('IndustrialCenterAres', function() {
  let card: IndustrialCenterAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new IndustrialCenterAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', function() {
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    expect(game.board.getCitiesOnMars()).has.length(1);

    const action = cast(card.play(player), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });
});
