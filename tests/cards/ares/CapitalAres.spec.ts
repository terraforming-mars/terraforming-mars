import {expect} from 'chai';
import {CapitalAres} from '../../../src/server/cards/ares/CapitalAres';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('CapitalAres', () => {
  let card: CapitalAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CapitalAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile?.tileType).to.eq(TileType.CAPITAL);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
