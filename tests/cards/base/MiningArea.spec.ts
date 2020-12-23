import {expect} from 'chai';
import {MiningArea} from '../../../src/cards/base/MiningArea';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestingUtils';

describe('MiningArea', function() {
  let card : MiningArea; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MiningArea();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
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
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);
    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_AREA);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) === -1 && space.bonus.indexOf(SpaceBonus.STEEL) !== -1);
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);
    action.cb(steelSpace!);
    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_AREA);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });
});
