import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast, runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonMineStandardProject} from '../../../src/server/cards/moon/MoonMineStandardProject';
import {SelectPaymentDeferred} from '../../../src/server/deferredActions/SelectPaymentDeferred';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {Payment} from '../../../src/common/inputs/Payment';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {TileType} from '../../../src/common/TileType';

describe('MoonMineStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MoonMineStandardProject;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MoonMineStandardProject();
  });

  it('can act', () => {
    player.titanium = 1;
    player.megaCredits = 19;
    expect(player.canPlay(card)).is.false;

    player.titanium = 0;
    player.megaCredits = 20;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 20;
    expect(player.canPlay(card)).is.true;

    // 2. Are there spaces on the moon for a Mine?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(20);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(16);
  });

  it('act', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(player.production.steel).eq(0);

    card.action(player);
    const payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    payAction.cb(Payment.EMPTY);

    expect(player.titanium).eq(2);
    expect(player.production.steel).eq(1);
    expect(moonData.miningRate).eq(0);

    runAllActions(game);
    UnderworldTestHelper.assertPlaceTile(player, player.popWaitingFor(), TileType.MOON_MINE);

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can act when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);

    // Card requirements
    player.titanium = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3, /* canAct */ true);
    moonData.miningRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0, /* canAct */ true);
  });
});

