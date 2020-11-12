import * as constants from '../../../src/constants';
import {expect} from 'chai';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {StormCraftIncorporated} from '../../../src/cards/colonies/StormCraftIncorporated';
import {Color} from '../../../src/Color';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';

describe('StormCraftIncorporated', function() {
  it('Should play', function() {
    const card = new StormCraftIncorporated();
    const player = new Player('test', Color.BLUE, false);
    const play = card.play();
    expect(play).is.undefined;

    player.corporationCard = card;

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
  });
  it('Restricts amounts when converting heat', function() {
    const card = new StormCraftIncorporated();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('solo1', [player], player);
    player.heat = 10;
    card.resourceCount = 10;
    const action = card.convertHeatIntoTemperature(game, player);
    const options = action.cb() as AndOptions;
    expect(options.options.length).to.eq(2);
    const heatOption = options.options[0] as SelectAmount;
    expect(heatOption.max).to.eq(constants.HEAT_FOR_TEMPERATURE);
    const floaterOption = options.options[1] as SelectAmount;
    expect(floaterOption.max).to.eq(constants.HEAT_FOR_TEMPERATURE / 2);
  });
  it('Validates inputs', function() {
    const card = new StormCraftIncorporated();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('solo1', [player], player);
    player.heat = 10;
    card.resourceCount = 10;
    const action = card.convertHeatIntoTemperature(game, player);
    const options = action.cb() as AndOptions;
    const heatOption = options.options[0] as SelectAmount;
    const floaterOption = options.options[1] as SelectAmount;
    heatOption.cb(4);
    floaterOption.cb(0);
    expect(function() {
      options.cb();
    }).to.throw(`Need to pay ${constants.HEAT_FOR_TEMPERATURE} heat`);
    heatOption.cb(10);
    expect(function() {
      options.cb();
    }).to.throw(`Only need to pay ${constants.HEAT_FOR_TEMPERATURE} heat`);
  });
  it('Converts heat with floaters and heat', function() {
    const card = new StormCraftIncorporated();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('solo1', [player], player);
    player.heat = 10;
    card.resourceCount = 10;
    const action = card.convertHeatIntoTemperature(game, player);
    const options = action.cb() as AndOptions;
    const heatOption = options.options[0] as SelectAmount;
    const floaterOption = options.options[1] as SelectAmount;
    heatOption.cb(2);
    floaterOption.cb(3);
    options.cb();
    expect(player.heat).to.eq(8);
    expect(card.resourceCount).to.eq(7);
    expect(game.getTemperature()).to.eq(constants.MIN_TEMPERATURE + 2);
  });
});
