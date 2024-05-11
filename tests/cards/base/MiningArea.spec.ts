import {expect} from 'chai';
import {MiningArea} from '../../../src/server/cards/base/MiningArea';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MiningArea', function() {
  let card: MiningArea;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new MiningArea();
    [game, player] = testGame(2);
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    for (const spaces of game.board.getAvailableSpacesOnLand(player)) {
      if (spaces.bonus.includes(SpaceBonus.STEEL) || spaces.bonus.includes(SpaceBonus.TITANIUM)) {
        const adjacents = game.board.getAdjacentSpaces(spaces);
        for (const adjacent of adjacents) {
          if (adjacent.tile === undefined && adjacent.bonus.length === 0) {
            game.addTile(player, adjacent, {tileType: TileType.MINING_AREA});
          }
        }
      }
    }

    const selectSpace = cast(card.play(player), SelectSpace);

    const titaniumSpace = selectSpace.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false)!;
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace.bonus).contains(SpaceBonus.TITANIUM);
    expect(titaniumSpace.bonus).does.not.contain(SpaceBonus.STEEL);

    selectSpace.cb(titaniumSpace);
    runAllActions(game);

    expect(titaniumSpace.player).to.eq(player);
    expect(titaniumSpace.tile?.tileType).to.eq(TileType.MINING_AREA);
    expect(player.production.titanium).to.eq(1);
    expect(titaniumSpace.adjacency?.bonus).eq(undefined);

    const steelSpace = selectSpace.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL))!;
    expect(steelSpace).is.not.undefined;
    expect(steelSpace.bonus).contains(SpaceBonus.STEEL);

    selectSpace.cb(steelSpace);
    runAllActions(game);

    expect(steelSpace.player).to.eq(player);
    expect(steelSpace.tile?.tileType).to.eq(TileType.MINING_AREA);
    expect(player.production.steel).to.eq(1);
    expect(steelSpace.adjacency?.bonus).eq(undefined);
  });
});
