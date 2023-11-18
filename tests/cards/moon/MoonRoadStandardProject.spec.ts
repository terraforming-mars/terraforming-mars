import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast, runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonRoadStandardProject} from '../../../src/server/cards/moon/MoonRoadStandardProject';
import {SelectPaymentDeferred} from '../../../src/server/deferredActions/SelectPaymentDeferred';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {Phase} from '../../../src/common/Phase';
import {Payment} from '../../../src/common/inputs/Payment';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {TileType} from '../../../src/common/TileType';

describe('MoonRoadStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MoonRoadStandardProject;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MoonRoadStandardProject();
  });

  it('can act', () => {
    player.steel = 0;
    player.megaCredits = 18;
    expect(player.canPlay(card)).is.false;

    player.steel = 1;
    player.megaCredits = 17;
    expect(player.canPlay(card)).is.false;

    player.steel = 1;
    player.megaCredits = 18;
    expect(player.canPlay(card)).is.true;

    // 2. Are there spaces on the moon for a Road?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(18);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(14);
  });

  it('act', () => {
    player.steel = 3;
    expect(player.getTerraformRating()).eq(14);

    card.action(player);
    const payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    payAction.cb(Payment.EMPTY);

    expect(player.steel).eq(2);
    expect(moonData.logisticRate).eq(0);

    runAllActions(game);
    UnderworldTestHelper.assertPlaceTile(player, player.popWaitingFor(), TileType.MOON_ROAD);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });


  it('can act when Reds are in power.', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.steel = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.logisticRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

