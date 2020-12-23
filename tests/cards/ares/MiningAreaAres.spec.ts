import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';
import {MiningAreaAres} from '../../../src/cards/ares/MiningAreaAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('MiningAreaAres', function() {
  let card : MiningAreaAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MiningAreaAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      if (land.bonus.indexOf(SpaceBonus.STEEL) !== -1 || land.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
        const adjacents = game.board.getAdjacentSpaces(land);
        for (const adjacent of adjacents) {
          if (adjacent.tile === undefined && adjacent.bonus.length === 0) {
            game.addTile(player, adjacent.spaceType, adjacent, {tileType: TileType.MINING_AREA});
          }
        }
      }
    }

    const action = card.play(player, game);
    expect(action instanceof SelectSpace).is.true;

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1 && space.bonus.indexOf(SpaceBonus.STEEL) === -1);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus[0]).equal(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);

    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_TITANIUM_BONUS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});

    const steelSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) === -1 && space.bonus.indexOf(SpaceBonus.STEEL) !== -1);
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus[0]).equal(SpaceBonus.STEEL);
    action.cb(steelSpace!);
    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_STEEL_BONUS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });
});
