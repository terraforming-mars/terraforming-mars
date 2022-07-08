import {expect} from 'chai';
import * as constants from '../../../src/common/constants';
import {Research} from '../../../src/cards/base/Research';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {ICard} from '../../../src/cards/ICard';
import {Atmoscoop} from '../../../src/cards/venusNext/Atmoscoop';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {SelectOption} from '../../../src/inputs/SelectOption';

describe('Atmoscoop', function() {
  let card : Atmoscoop; let player : Player; let game : Game; let dirigibles: Dirigibles; let floatingHabs: FloatingHabs;

  beforeEach(function() {
    card = new Atmoscoop();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, setCustomGameOptions({venusNextExtension: true}));
    dirigibles = new Dirigibles();
    floatingHabs = new FloatingHabs();
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

    const action = cast(card.play(player), OrOptions);

    const orOptions = cast(action.options[1], SelectOption);
    orOptions.cb();
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
    const selectCard = orOptions.cb() as SelectCard<ICard>;
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
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - single target, both global parameters maxed', function() {
    player.playedCards.push(dirigibles);
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    (game as any).temperature = constants.MAX_TEMPERATURE;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, one global parameter maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    (game as any).temperature = constants.MAX_TEMPERATURE;

    const action = card.play(player) as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);

    action.cb([dirigibles]);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets, both global parameters maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    (game as any).temperature = constants.MAX_TEMPERATURE;

    const action = card.play(player) as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);
    action.cb([dirigibles]);
    expect(dirigibles.resourceCount).to.eq(2);
  });
});
