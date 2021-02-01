import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';
import {MiningRightsAres} from '../../../src/cards/ares/MiningRightsAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('MiningRightsAres', function() {
  let card : MiningRightsAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MiningRightsAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action instanceof SelectSpace).is.true;

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;
    action.cb(titaniumSpace!);
    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_TITANIUM_BONUS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;
    action.cb(steelSpace!);
    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_STEEL_BONUS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });

  it('Candidate spaces can\'t include hazards', function() {
    const land = game.board.getAvailableSpacesOnLand(player)
      .find((land) => land.bonus.includes(SpaceBonus.STEEL))!;

    let action = card.play(player) as SelectSpace;
    const size = action.availableSpaces.length;
    expect(action.availableSpaces).contains(land);

    land.tile = {tileType: TileType.MINING_RIGHTS};
    action = card.play(player) as SelectSpace;
    expect(action.availableSpaces).has.length(size - 1);
    expect(action.availableSpaces).does.not.contain(land);
  });
});
