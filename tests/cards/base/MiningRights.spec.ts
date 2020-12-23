import {expect} from 'chai';
import {MiningRights} from '../../../src/cards/base/MiningRights';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestingUtils';

describe('MiningRights', function() {
  let card : MiningRights; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MiningRights();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play if no available spaces', function() {
    for (const land of game.board.getAvailableSpacesOnLand(player)) {
      if (land.bonus.indexOf(SpaceBonus.STEEL) !== -1 || land.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
        game.addTile(player, land.spaceType, land, {tileType: TileType.MINING_RIGHTS});
      }
    }
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action instanceof SelectSpace).is.true;

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1 && space.bonus.indexOf(SpaceBonus.STEEL) === -1);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);
    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.indexOf(SpaceBonus.TITANIUM) === -1 && space.bonus.indexOf(SpaceBonus.STEEL) !== -1);
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace!);
    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });
});
