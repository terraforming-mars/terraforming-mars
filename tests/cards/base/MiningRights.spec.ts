import {expect} from 'chai';
import {MiningRights} from '../../../src/server/cards/base/MiningRights';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {runAllActions, cast} from '../../TestingUtils';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Units} from '../../../src/common/Units';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('MiningRights', () => {
  let card: MiningRights;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MiningRights();
    [game, player] = testGame(2);
  });

  it('Cannot play if no available spaces', () => {
    for (const land of game.board.getAvailableSpacesOnLand(player)) {
      if (land.bonus.includes(SpaceBonus.STEEL) || land.bonus.includes(SpaceBonus.TITANIUM)) {
        game.addTile(player, land, {tileType: TileType.MINING_RIGHTS});
      }
    }
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - titanium', () => {
    const action = cast(card.play(player), SelectSpace);

    const titaniumSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false)!;
    expect(titaniumSpace.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace);
    runAllActions(game);

    expect(titaniumSpace.player).to.eq(player);
    expect(titaniumSpace.tile?.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
    expect(titaniumSpace.adjacency?.bonus).eq(undefined);
  });

  it('Should play - steel', () => {
    const action = cast(card.play(player), SelectSpace);

    const steelSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL))!;
    expect(steelSpace.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace);
    runAllActions(game);

    expect(steelSpace.player).to.eq(player);
    expect(steelSpace.tile?.tileType).to.eq(TileType.MINING_RIGHTS);
    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));
    expect(steelSpace.adjacency?.bonus).eq(undefined);
  });

  it('Should play when space bonus is both steel and titanium', () => {
    const action = cast(card.play(player), SelectSpace);
    const space = action.spaces.find(
      (space) => space.tile === undefined &&
        space.bonus.includes(SpaceBonus.TITANIUM) &&
        space.bonus.includes(SpaceBonus.STEEL) === false)!;
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.TITANIUM];

    action.cb(space);

    expect(game.deferredActions).has.length(1);

    const deferredAction = game.deferredActions.pop();

    const orOptions = cast(deferredAction?.execute(), OrOptions);

    orOptions.options[0].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));
    expect(card.bonusResource).deep.eq([Resource.STEEL]);
  });

  it('Should play when space bonus is both steel and titanium, plus Robotic Workforce works correctly', () => {
    const action = cast(card.play(player), SelectSpace);
    const space = action.spaces.find(
      (space) => space.tile === undefined &&
        space.bonus.includes(SpaceBonus.TITANIUM) &&
        space.bonus.includes(SpaceBonus.STEEL) === false)!;
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.TITANIUM];

    action.cb(space);

    const deferredAction = game.deferredActions.pop();
    const orOptions = cast(deferredAction?.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));

    player.playedCards.push(card);

    const roboticWorkforce = new RoboticWorkforce();
    cast(roboticWorkforce.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);
    expect(player.production.asUnits()).deep.eq(Units.of({steel: 2}));
  });
});
