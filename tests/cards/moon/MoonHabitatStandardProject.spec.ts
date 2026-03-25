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
import {assertPlaceMoonHabitat} from '../../assertions';
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

  for (const run of [
    {titanium: 0, mc: 22, expected: false},
    {titanium: 1, mc: 21, expected: false},
    {titanium: 1, mc: 22, expected: true},
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
      player.megaCredits = 22;
      const moonData = MoonExpansion.moonData(player.game);
      const spaces = [...moonData.moon.getAvailableSpacesOnLand(player)];
      while (spaces.length > run.availableSpaces) {
        const space = spaces.pop();
        space!.tile = {tileType: TileType.MOON_ROAD};
      }
      expect(card.canAct(player)).eq(run.expected);
    });
  }

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
    expect(player.terraformRating).eq(14);
    expect(player.production.megacredits).eq(0);
    player.megaCredits = 22;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.production.megacredits).eq(1);
    expect(moonData.habitatRate).eq(0);

    assertPlaceMoonHabitat(player, player.popWaitingFor());

    expect(moonData.habitatRate).eq(1);
    expect(player.terraformRating).eq(15);
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

