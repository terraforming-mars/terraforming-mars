import {expect} from 'chai';
import {MiningRights} from '../../../src/cards/base/MiningRights';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';
import {ISpace} from '../../../src/boards/ISpace';
import {TestingUtils} from '../../TestingUtils';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Units} from '../../../src/common/Units';
import {Resources} from '../../../src/common/Resources';

describe('MiningRights', () => {
  let card : MiningRights; let player : TestPlayer; let game : Game;

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

  it('Should play - titanium', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);
    TestingUtils.runAllActions(game);

    expect(titaniumSpace!.player).to.eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProductionForTest()).deep.eq(Units.of({titanium: 1}));
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);
  });

  it('Should play - steel', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace!);
    TestingUtils.runAllActions(game);

    expect(steelSpace!.player).to.eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 1}));
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });

  it('Should play when space bonus is both steel and titanium', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    const space = action.availableSpaces.find((space) => space.tile === undefined && space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false) as ISpace;
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.TITANIUM];

    action.cb(space);

    expect(game.deferredActions.length).eq(1);

    const deferredAction = game.deferredActions.pop();

    const orOptions = deferredAction?.execute() as OrOptions;

    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 1}));
    expect(card.bonusResource).deep.eq([Resources.STEEL]);
  });

  it('Should play when space bonus is both steel and titanium, plus Robotic Workforce works correctly', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    const space = action.availableSpaces.find((space) => space.tile === undefined && space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false) as ISpace;
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.TITANIUM];

    action.cb(space);

    const deferredAction = game.deferredActions.pop();
    const orOptions = deferredAction?.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 1}));

    player.playedCards = [card];

    const roboticWorkforce = new RoboticWorkforce();
    const selectCard = TestingUtils.cast(roboticWorkforce.play(player), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    TestingUtils.runAllActions(game);
    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 2}));
  });
});
