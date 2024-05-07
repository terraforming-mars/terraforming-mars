import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast, runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProject} from '../../../src/server/cards/moon/MoonHabitatStandardProject';
import {SelectPaymentDeferred} from '../../../src/server/deferredActions/SelectPaymentDeferred';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {Payment} from '../../../src/common/inputs/Payment';
import {assertPlaceTile} from '../../assertions';
import {TileType} from '../../../src/common/TileType';

describe('MoonHabitatStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MoonHabitatStandardProject;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MoonHabitatStandardProject();
  });

  it('can act', () => {
    player.titanium = 0;
    player.megaCredits = 22;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 21;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 22;
    expect(player.canPlay(card)).is.true;

    // TODO(kberg): Are there spaces on the moon for a habitat?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(22);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(18);
  });

  it('act', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(player.production.megacredits).eq(0);

    card.action(player);
    const payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    payAction.cb(Payment.EMPTY);

    expect(player.titanium).eq(2);
    expect(player.production.megacredits).eq(1);

    expect(moonData.habitatRate).eq(0);

    runAllActions(game);
    assertPlaceTile(player, player.popWaitingFor(), TileType.MOON_HABITAT);

    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can act when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);

    // Card requirements
    player.titanium = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.habitatRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

