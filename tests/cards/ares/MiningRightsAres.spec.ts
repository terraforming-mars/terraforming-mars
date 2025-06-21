import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {MiningRightsAres} from '../../../src/server/cards/ares/MiningRightsAres';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MiningRightsAres', () => {
  let card: MiningRightsAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MiningRightsAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    const action = cast(card.play(player), SelectSpace);

    const titaniumSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false)!;
    expect(titaniumSpace).is.not.undefined;

    action.cb(titaniumSpace);
    runAllActions(game);

    expect(titaniumSpace.player).to.eq(player);
    expect(titaniumSpace.tile?.tileType).to.eq(TileType.MINING_TITANIUM_BONUS);
    expect(player.production.titanium).to.eq(1);
    expect(titaniumSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});

    const steelSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL))!;
    expect(steelSpace).is.not.undefined;

    action.cb(steelSpace);
    runAllActions(game);

    expect(steelSpace.player).to.eq(player);
    expect(steelSpace.tile?.tileType).to.eq(TileType.MINING_STEEL_BONUS);
    expect(player.production.steel).to.eq(1);
    expect(steelSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });

  it('Candidate spaces can not include hazards', () => {
    const land = game.board.getAvailableSpacesOnLand(player)
      .find((land) => land.bonus.includes(SpaceBonus.STEEL))!;

    let action = cast(card.play(player), SelectSpace);
    const size = action.spaces.length;
    expect(action.spaces).contains(land);

    land.tile = {tileType: TileType.MINING_RIGHTS};
    action = cast(card.play(player), SelectSpace);
    expect(action.spaces).has.length(size - 1);
    expect(action.spaces).does.not.contain(land);
  });
});
