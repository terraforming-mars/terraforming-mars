import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Resource} from '../../../src/common/Resource';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Ryu} from '../../../src/server/cards/ceos/Ryu';


describe('Ryu', function() {
  let card: Ryu;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ryu();
    [game, player] = testGame(1);

    player.production.add(Resource.STEEL, 1);
    player.production.add(Resource.HEAT, 4);
    player.playedCards.push(card);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Cannot act', function() {
    player.production.override({
      megacredits: -5,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });
    expect(card.canAct(player)).is.false;
  });

  it('Takes action in Gen 1', function() {
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = cast(card.action(player), OrOptions);
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 1
    const selectAmount = cast(selectProductionToDecrease.options[0].cb(), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
  });

  it('Takes action in Gen 4', function() {
    game.generation = 4;
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = cast(card.action(player), OrOptions);
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 4
    let selectAmount = cast(selectProductionToDecrease.options[0].cb(), SelectAmount);
    expect(selectAmount.max).eq(5);

    // Select amount of Steel prod to lose - Gen 4
    selectAmount = cast(selectProductionToDecrease.options[1].cb(), SelectAmount);
    expect(selectAmount.max).eq(1);

    // Select amount of Heat prod to lose - Gen 4
    selectAmount = cast(selectProductionToDecrease.options[2].cb(), SelectAmount);
    expect(selectAmount.max).eq(4);

    // Swap 4 Heat prod for Ti prod
    const selectProductionToIncrease = cast(selectAmount.cb(4), OrOptions);
    expect(selectProductionToIncrease.options).has.length(5);
    selectProductionToIncrease.options[2].cb();

    expect(player.production.heat).to.eq(0);
    expect(player.production.titanium).to.eq(4);
    expect(card.isDisabled).is.true;
  });
});
