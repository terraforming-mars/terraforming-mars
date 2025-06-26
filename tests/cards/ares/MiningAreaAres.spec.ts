import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {MiningAreaAres} from '../../../src/server/cards/ares/MiningAreaAres';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MiningAreaAres', () => {
  let card: MiningAreaAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MiningAreaAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      if (land.bonus.includes(SpaceBonus.STEEL) || land.bonus.includes(SpaceBonus.TITANIUM)) {
        const adjacents = game.board.getAdjacentSpaces(land);
        for (const adjacent of adjacents) {
          if (adjacent.tile === undefined && adjacent.bonus.length === 0) {
            game.addTile(player, adjacent, {tileType: TileType.MINING_AREA});
          }
        }
      }
    }

    const action = cast(card.play(player), SelectSpace);

    const titaniumSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false)!;
    expect(titaniumSpace.bonus[0]).equal(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace);
    runAllActions(game);

    expect(titaniumSpace.player).to.eq(player);
    expect(titaniumSpace.tile?.tileType).to.eq(TileType.MINING_TITANIUM_BONUS);
    expect(player.production.titanium).to.eq(1);
    expect(titaniumSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});

    const steelSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL))!;
    expect(steelSpace.bonus[0]).equal(SpaceBonus.STEEL);

    action.cb(steelSpace);
    runAllActions(game);

    expect(steelSpace.player).to.eq(player);
    expect(steelSpace.tile?.tileType).to.eq(TileType.MINING_STEEL_BONUS);
    expect(player.production.titanium).to.eq(1);
    expect(steelSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });
});
