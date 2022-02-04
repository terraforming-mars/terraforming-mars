import {expect} from 'chai';
import {MiningArea} from '../../../src/cards/base/MiningArea';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('MiningArea', function() {
  let card : MiningArea; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new MiningArea();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      if (land.bonus.includes(SpaceBonus.STEEL) || land.bonus.includes(SpaceBonus.TITANIUM)) {
        const adjacents = game.board.getAdjacentSpaces(land);
        for (const adjacent of adjacents) {
          if (adjacent.tile === undefined && adjacent.bonus.length === 0) {
            game.addTile(player, adjacent.spaceType, adjacent, {tileType: TileType.MINING_AREA});
          }
        }
      }
    }

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);
    expect(titaniumSpace!.bonus).does.not.contain(SpaceBonus.STEEL);

    action.cb(titaniumSpace!);
    TestingUtils.runAllActions(game);

    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_AREA);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace!);
    TestingUtils.runAllActions(game);

    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_AREA);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });
});
