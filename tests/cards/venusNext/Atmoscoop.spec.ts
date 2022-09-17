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
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {SelectOption} from '../../../src/server/inputs/SelectOption';

describe('Atmoscoop', function() {
  let card: Atmoscoop;
  let player: TestPlayer;
  let game: Game;
  let dirigibles: Dirigibles;
  let floatingHabs: FloatingHabs;

  beforeEach(function() {
    card = new Atmoscoop();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({venusNextExtension: true}));
    dirigibles = new Dirigibles();
    floatingHabs = new FloatingHabs();
    player.popSelectInitialCards();
  });

  it('Cannot play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play - no targets', function() {
    player.playedCards.push(new Research(), new SearchForLife());
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = cast(action.options[1], SelectOption);

    orOptions.cb();
    expect(game.getVenusScaleLevel()).to.eq(4);
  });

  it('Should play - single target', function() {
    player.playedCards.push(dirigibles);

    const orOptions = cast(card.play(player), OrOptions);
    const selectOption = cast(orOptions.options[1], SelectOption);
    selectOption.cb();

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

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
    (game as any).temperature = constants.MAX_TEMPERATURE;

    const action = card.play(player);
    expect(action).is.undefined;

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - single target, both global parameters maxed', function() {
    player.playedCards.push(dirigibles);
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    (game as any).temperature = constants.MAX_TEMPERATURE;

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, one global parameter maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    (game as any).temperature = constants.MAX_TEMPERATURE;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

    action.cb([dirigibles]);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, both global parameters maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    (game as any).temperature = constants.MAX_TEMPERATURE;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

    action.cb([dirigibles]);
    expect(dirigibles.resourceCount).to.eq(2);
  });
});
