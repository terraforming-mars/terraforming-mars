import {expect} from 'chai';
import * as constants from '../../../src/common/constants';
import {Research} from '../../../src/server/cards/base/Research';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {ICard} from '../../../src/server/cards/ICard';
import {Atmoscoop} from '../../../src/server/cards/venusNext/Atmoscoop';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setTemperature, setVenusScaleLevel} from '../../TestingUtils';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {testGame} from '../../TestGame';

describe('Atmoscoop', function() {
  let card: Atmoscoop;
  let player: TestPlayer;
  let game: Game;
  let dirigibles: Dirigibles;
  let floatingHabs: FloatingHabs;

  beforeEach(function() {
    card = new Atmoscoop();
    [game, player] = testGame(2, {venusNextExtension: true});
    dirigibles = new Dirigibles();
    floatingHabs = new FloatingHabs();
  });

  it('Cannot play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - no targets', function() {
    player.playedCards.push(new Research(), new SearchForLife());
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = cast(action.options[1], SelectOption);

    orOptions.cb(undefined);
    expect(game.getVenusScaleLevel()).to.eq(4);
  });

  it('Should play - single target', function() {
    player.playedCards.push(dirigibles);

    const orOptions = cast(card.play(player), OrOptions);
    const selectOption = cast(orOptions.options[1], SelectOption);
    selectOption.cb(undefined);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    player.playedCards.push(dirigibles, floatingHabs);

    const orOptions = cast(card.play(player), OrOptions);

    // First the global parameter
    orOptions.options[0].cb();
    expect(game.getTemperature()).to.eq(-26);
    orOptions.options[1].cb();
    expect(game.getVenusScaleLevel()).to.eq(4);


    // Then the floaters
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCard.cb([dirigibles]);
    expect(dirigibles.resourceCount).to.eq(2);
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(2);
  });

  it('Should play - single target, one global parameter maxed', function() {
    player.playedCards.push(dirigibles);
    setTemperature(game, constants.MAX_TEMPERATURE);

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - single target, both global parameters maxed', function() {
    player.playedCards.push(dirigibles);
    setVenusScaleLevel(game, constants.MAX_VENUS_SCALE);
    setTemperature(game, constants.MAX_TEMPERATURE);

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, one global parameter maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    setTemperature(game, constants.MAX_TEMPERATURE);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

    action.cb([dirigibles]);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, both global parameters maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    setVenusScaleLevel(game, constants.MAX_VENUS_SCALE);
    setTemperature(game, constants.MAX_TEMPERATURE);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

    action.cb([dirigibles]);
    expect(dirigibles.resourceCount).to.eq(2);
  });
});
