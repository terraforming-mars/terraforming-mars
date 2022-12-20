import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {OrOptions} from "../../../src/server/inputs/OrOptions";
import {SelectAmount} from "../../../src/server/inputs/SelectAmount";
import {Resources} from "../../../src/common/Resources";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';

import {Ryu} from "../../../src/server/cards/leaders/Ryu";


describe('Ryu', function() {
  let card: Ryu;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ryu();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    player.production.add(Resources.STEEL, 1);
    player.production.add(Resources.HEAT, 4);
  });

  it('Cannot act', function() {
    [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT]
      .forEach((res) => player.production.add(res, -5));

    expect(card.canAct(player)).is.false;
  })

  it('Takes action in Gen 1', function() {
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = card.action(player) as OrOptions;
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 1
    let selectAmount = selectProductionToDecrease.options[0].cb() as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
  });

  it('Takes action in Gen 4', function() {
    game.generation = 4;
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = card.action(player) as OrOptions;
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 4
    let selectAmount = selectProductionToDecrease.options[0].cb() as SelectAmount;
    expect(selectAmount.max).eq(5);

    // Select amount of Steel prod to lose - Gen 4
    selectAmount = selectProductionToDecrease.options[1].cb() as SelectAmount;
    expect(selectAmount.max).eq(1);

    // Select amount of Heat prod to lose - Gen 4
    selectAmount = selectProductionToDecrease.options[2].cb() as SelectAmount;
    expect(selectAmount.max).eq(4);

    // Swap 4 Heat prod for Ti prod
    const selectProductionToIncrease = selectAmount.cb(4) as OrOptions;;
    expect(selectProductionToIncrease.options).has.length(5);
    selectProductionToIncrease.options[2].cb();

    expect(player.production.heat).to.eq(0);
    expect(player.production.titanium).to.eq(4);
    expect(card.isDisabled).is.true;
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
