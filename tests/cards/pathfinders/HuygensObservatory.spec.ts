import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {HuygensObservatory} from '../../../src/server/cards/pathfinders/HuygensObservatory';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {Units} from '../../../src/common/Units';
import {IColony} from '../../../src/server/colonies/IColony';

describe('HuygensObservatory', () => {
  let card: HuygensObservatory;
  let player: TestPlayer;
  let game: IGame;
  let ganymede: IColony;

  beforeEach(() => {
    card = new HuygensObservatory();
    // By choosing 2 players I don't have to pay attention to the first action which
    // removes a colony tile.
    [game, player/* , player2*/] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.GANYMEDE,
        ColonyName.TRITON,
        ColonyName.CERES,
        ColonyName.LEAVITT,
        ColonyName.EUROPA,
      ],
    });
    ganymede = game.colonies.find((colony) => colony.name === ColonyName.GANYMEDE)!;
  });

  it('can play, trade fleet home', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('can play, trade fleet on a colony tile', () => {
    ganymede.trade(player);

    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play, cannot place a colony', () => {
    for (const colony of player.game.colonies) {
      colony.colonies = [player.id, player.id, player.id];
    }

    expect(card.canPlay(player)).is.false;
  });

  it('Can play even if you have a colony where you already have one.', () => {
    for (const colony of player.game.colonies) {
      colony.colonies = [player.id, player.id, player.id];
    }

    expect(card.canPlay(player)).is.false;

    ganymede.colonies.pop();

    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play, cannot trade', () => {
    for (const colony of player.game.colonies) {
      expect(card.canPlay(player)).is.true;
      colony.visitor = player.id;
    }

    expect(card.canPlay(player)).is.false;
  });

  it('Cannot play, trade embargo', () => {
    player.game.tradeEmbargo = true;
    expect(card.canPlay(player)).is.false;
  });

  it('play, simple case (place colony, trade with it)', () => {
    expect(player.getTerraformRating()).eq(20);
    const action = card.play(player);

    cast(action, undefined);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    expect(player.getTerraformRating()).eq(21);

    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).has.length(5);
    expect(selectColony.title).eq('Select colony for Huygens Observatory');

    // Gain plant production
    selectColony.cb(ganymede);

    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1}));
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    expect(ganymede.visitor).is.undefined;

    runAllActions(game);

    const tradeDestination = cast(player.popWaitingFor(), SelectColony);

    expect(tradeDestination.colonies).has.length(5);

    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
    tradeDestination.cb(ganymede);
    expect(ganymede.visitor).eq(player.id);

    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1}));
    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('play, place colony where you already have one', () => {
    ganymede.addColony(player);
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1}));
    const action = card.play(player);

    cast(action, undefined);

    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).has.length(5);
    expect(selectColony.colonies.map(toName)).contains(ColonyName.GANYMEDE);

    // Gain plant production
    selectColony.cb(ganymede);

    expect(player.production.asUnits()).deep.eq(Units.of({plants: 2}));
  });

  it('play, cannot place a colony', () => {
    player.game.colonies.forEach((c) => {
      c.colonies[0] = player.id;
      c.colonies[1] = player.id;
      c.colonies[2] = player.id;
    });

    card.play(player);

    runAllActions(game);

    // Go straight to trade
    const tradeDestination = cast(player.popWaitingFor(), SelectColony);
    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
    expect(tradeDestination.colonies).has.length(5);

    tradeDestination.cb(ganymede);
    expect(ganymede.visitor).eq(player.id);

    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('play, only trade fleet is on a colony', () => {
    ganymede.trade(player);
    expect(ganymede.visitor).eq(player.id);

    const action = card.play(player);

    cast(action, undefined);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    runAllActions(game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(ganymede);

    expect(ganymede.visitor).eq(player.id);

    runAllActions(game);

    const recallTradeFleet = cast(player.popWaitingFor(), SelectColony);

    expect(selectColony.colonies).has.length(5);

    expect(recallTradeFleet.title).eq('Select a colony tile to recall a trade fleet from');
    recallTradeFleet.cb(ganymede);
    expect(ganymede.visitor).eq(undefined);

    runAllActions(game);

    const tradeDestination = cast(player.popWaitingFor(), SelectColony);

    expect(tradeDestination.colonies).has.length(4);
    expect(tradeDestination.colonies.map(toName)).does.not.contain(ColonyName.GANYMEDE);
    expect(tradeDestination.title).eq('Select colony tile to trade with for free');
  });

  it('play, trade fleet on colony or home', () => {
    ganymede.trade(player);
    expect(ganymede.visitor).eq(player.id);
    player.colonies.increaseFleetSize();

    const action = card.play(player);

    cast(action, undefined);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    runAllActions(game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(ganymede);

    expect(ganymede.visitor).eq(player.id);

    runAllActions(game);

    const chooseTradeFleet = cast(player.popWaitingFor(), OrOptions);
    expect(chooseTradeFleet.options).has.length(2);

    const recallTradeFleet = cast(chooseTradeFleet.options[0], SelectColony);

    expect(recallTradeFleet.colonies).has.length(1);
    expect(recallTradeFleet.colonies[0].name).eq(ColonyName.GANYMEDE);
    expect(recallTradeFleet.title).eq('Select a colony tile to recall a trade fleet from');

    // Ignored. We know this is the "use an existing unused trade fleet"
    cast(chooseTradeFleet.options[1], SelectOption);
    runAllActions(game);
  });
});
