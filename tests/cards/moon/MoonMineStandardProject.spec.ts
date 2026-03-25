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
import {assertPlaceMoonMine} from '../../assertions';
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

  for (const run of [
    {titanium: 0, mc: 20, expected: false},
    {titanium: 1, mc: 19, expected: false},
    {titanium: 1, mc: 20, expected: true},
  ] as const) {
    it('can act ' + JSON.stringify(run), () => {
      player.titanium = run.titanium;
      player.megaCredits = run.mc;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  for (const run of [
    {availableSpaces: 1, expected: true},
    {availableSpaces: 0, expected: false},
  ] as const) {
    it('can act, available space ' + JSON.stringify(run), () => {
      player.titanium = 1;
      player.megaCredits = 20;
      const moonData = MoonExpansion.moonData(player.game);
      const spaces = [...moonData.moon.getAvailableSpacesForMine(player)];
      while (spaces.length > run.availableSpaces) {
        const space = spaces.pop();
        space!.tile = {tileType: TileType.MOON_MINE};
      }
      expect(card.canAct(player)).eq(run.expected);
    });
  }

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
    expect(player.terraformRating).eq(14);
    expect(player.production.steel).eq(0);
    player.megaCredits = 20;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.production.steel).eq(1);
    expect(moonData.miningRate).eq(0);

    assertPlaceMoonMine(player, player.popWaitingFor());

    expect(moonData.miningRate).eq(1);
    expect(player.terraformRating).eq(15);
  });

  it('can act when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);

    // Card requirements
    player.titanium = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.miningRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

