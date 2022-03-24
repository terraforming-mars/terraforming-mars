import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {HuygensObservatory} from '../../../src/cards/pathfinders/HuygensObservatory';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {SelectOption} from '../../../src/inputs/SelectOption';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestingUtils} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {IColony} from '../../../src/colonies/IColony';

describe('HuygensObservatory', function() {
  let card: HuygensObservatory;
  let player: TestPlayer;
  let game: Game;
  let ganymede: IColony;

  beforeEach(function() {
    card = new HuygensObservatory();
    // By choosing 2 players I don't have to pay attention to the first action which
    // removes a colony tile.
    game = newTestGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.GANYMEDE,
        ColonyName.TRITON,
        ColonyName.CERES,
        ColonyName.LEAVITT,
        ColonyName.EUROPA,
      ],
    });
    player = getTestPlayer(game, 0);
    ganymede = game.colonies.find((colony) => colony.name === ColonyName.GANYMEDE)!;
  });

  it('play, simple case (place colony, trade with it)', function() {
    expect(player.getTerraformRating()).eq(20);
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);
    expect(player.getTerraformRating()).eq(21);

    TestingUtils.runAllActions(game);

    const selectColony = TestingUtils.cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).has.length(5);
    expect(selectColony.title).eq('Select colony for Huygens Observatory');

    // Gain plant production
    selectColony.cb(ganymede);

    expect(player.getProductionForTest()).deep.eq(Units.of({plants: 1}));
    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(ganymede.visitor).is.undefined;

    TestingUtils.runAllActions(game);

    const tradeDestination = TestingUtils.cast(player.popWaitingFor(), SelectColony);

    expect(tradeDestination.colonies).has.length(5);

    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
    tradeDestination.cb(ganymede);
    expect(ganymede.visitor).eq(player.id);

    expect(player.getProductionForTest()).deep.eq(Units.of({plants: 1}));
    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1}));
  });

  it('play, place colony where you already have one', function() {
    ganymede.addColony(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({plants: 1}));
    const action = card.play(player);

    expect(action).is.undefined;

    TestingUtils.runAllActions(game);

    const selectColony = TestingUtils.cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).has.length(5);
    expect(selectColony.colonies.map((c) => c.name)).contains(ColonyName.GANYMEDE);

    // Gain plant production
    selectColony.cb(ganymede);

    expect(player.getProductionForTest()).deep.eq(Units.of({plants: 2}));
  });

  it('play, cannot place a colony', function() {
    player.game.colonies.forEach((c) => {
      c.colonies[0] = player.id;
      c.colonies[1] = player.id;
      c.colonies[2] = player.id;
    });

    card.play(player);

    TestingUtils.runAllActions(game);

    // Go straight to trade
    const tradeDestination = TestingUtils.cast(player.popWaitingFor(), SelectColony);
    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
    expect(tradeDestination.colonies).has.length(5);

    tradeDestination.cb(ganymede);
    expect(ganymede.visitor).eq(player.id);

    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);
    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1}));
  });

  it('play, only trade fleet is on a colony', function() {
    ganymede.trade(player);
    expect(ganymede.visitor).eq(player.id);

    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);

    TestingUtils.runAllActions(game);
    const selectColony = TestingUtils.cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(ganymede);

    expect(ganymede.visitor).eq(player.id);

    TestingUtils.runAllActions(game);

    const recallTradeFleet = TestingUtils.cast(player.popWaitingFor(), SelectColony);

    expect(selectColony.colonies).has.length(5);

    expect(recallTradeFleet.title).eq('Select a colony tile to recall a trade fleet from');
    recallTradeFleet.cb(ganymede);
    expect(ganymede.visitor).eq(undefined);

    TestingUtils.runAllActions(game);

    const tradeDestination = TestingUtils.cast(player.popWaitingFor(), SelectColony);

    expect(tradeDestination.colonies).has.length(4);
    expect(tradeDestination.colonies.map((c) => c.name)).does.not.contain(ColonyName.GANYMEDE);
    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
  });

  it('play, trade fleet on colony or home', function() {
    ganymede.trade(player);
    expect(ganymede.visitor).eq(player.id);
    player.increaseFleetSize();

    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);

    TestingUtils.runAllActions(game);
    const selectColony = TestingUtils.cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(ganymede);

    expect(ganymede.visitor).eq(player.id);

    TestingUtils.runAllActions(game);

    const chooseTradeFleet = TestingUtils.cast(player.popWaitingFor(), OrOptions);
    expect(chooseTradeFleet.options).has.length(2);

    const recallTradeFleet = TestingUtils.cast(chooseTradeFleet.options[0], SelectColony);

    expect(recallTradeFleet.colonies).has.length(1);
    expect(recallTradeFleet.colonies[0].name).eq(ColonyName.GANYMEDE);
    expect(recallTradeFleet.title).eq('Select a colony tile to recall a trade fleet from');

    // Ignored. We know this is the "use an existing unused trade fleet"
    TestingUtils.cast(chooseTradeFleet.options[1], SelectOption);
    TestingUtils.runAllActions(game);
  });
});
