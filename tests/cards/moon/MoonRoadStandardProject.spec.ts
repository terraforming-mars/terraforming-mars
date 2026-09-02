import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonRoadStandardProject} from '../../../src/server/cards/moon/MoonRoadStandardProject';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {assertPlaceMoonRoad} from '../../assertions';
import {TileType} from '../../../src/common/TileType';
import {Payment} from '../../../src/common/inputs/Payment';

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

  for (const run of [
    {steel: 0, mc: 18, expected: false},
    {steel: 1, mc: 17, expected: false},
    {steel: 1, mc: 18, expected: true},
  ] as const) {
    it('can act ' + JSON.stringify(run), () => {
      player.steel = run.steel;
      player.megaCredits = run.mc;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  for (const run of [
    {availableSpaces: 1, expected: true},
    {availableSpaces: 0, expected: false},
  ] as const) {
    it('can act, available space ' + JSON.stringify(run), () => {
      player.steel = 1;
      player.megaCredits = 18;
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
    expect(card.getAdjustedCost(player)).eq(18);

    player.playedCards.push(new MooncrateBlockFactory());
    expect(card.getAdjustedCost(player)).eq(14);
  });

  it('act', () => {
    player.steel = 3;
    expect(player.terraformRating).eq(14);
    player.megaCredits = 18;

    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    runAllActions(game);

    expect(player.steel).eq(2);
    expect(moonData.logisticRate).eq(0);

    assertPlaceMoonRoad(player, player.popWaitingFor());

    expect(moonData.logisticRate).eq(1);
    expect(player.terraformRating).eq(15);
  });


  it('can act when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    const moonData = MoonExpansion.moonData(game);

    // Card requirements
    player.steel = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.logisticRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});
