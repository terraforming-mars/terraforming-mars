import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {MiningRightsAres} from '../../../src/server/cards/ares/MiningRightsAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';

describe('MiningRightsAres', function() {
  let card: MiningRightsAres;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new MiningRightsAres();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const action = cast(card.play(player), SelectSpace);

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;

    action.cb(titaniumSpace!);
    runAllActions(game);

    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_TITANIUM_BONUS);
    expect(player.production.titanium).to.eq(1);
    expect(titaniumSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;

    action.cb(steelSpace!);
    runAllActions(game);

    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_STEEL_BONUS);
    expect(player.production.titanium).to.eq(1);
    expect(steelSpace!.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });

  it('Candidate spaces can not include hazards', function() {
    const land = game.board.getAvailableSpacesOnLand(player)
      .find((land) => land.bonus.includes(SpaceBonus.STEEL))!;

    let action = cast(card.play(player), SelectSpace);
    const size = action.availableSpaces.length;
    expect(action.availableSpaces).contains(land);

    land.tile = {tileType: TileType.MINING_RIGHTS};
    action = cast(card.play(player), SelectSpace);
    expect(action.availableSpaces).has.length(size - 1);
    expect(action.availableSpaces).does.not.contain(land);
  });
});
