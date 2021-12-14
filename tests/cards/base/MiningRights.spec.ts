import {expect} from 'chai';
import {MiningRights} from '../../../src/cards/base/MiningRights';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';
import {ISpace} from '../../../src/boards/ISpace';

describe('MiningRights', () => {
  let card : MiningRights; let player : Player; let game : Game;

  beforeEach(() => {
    card = new MiningRights();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play if no available spaces', () => {
    for (const land of game.board.getAvailableSpacesOnLand(player)) {
      if (land.bonus.includes(SpaceBonus.STEEL) || land.bonus.includes(SpaceBonus.TITANIUM)) {
        game.addTile(player, land.spaceType, land, {tileType: TileType.MINING_RIGHTS});
      }
    }
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);
    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace!);
    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });

  it('Should play when space bonus is both steel and titanium', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    const space = action.availableSpaces.find((space) => space.tile === undefined && space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false) as ISpace;
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.TITANIUM];

    action.cb(space);

    expect(card.bonusResource?.length).eq(2);

    expect(game.deferredActions.length).eq(1);

    const deferredAction = game.deferredActions.pop();

    const orOptions = deferredAction?.execute() as OrOptions;

    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
