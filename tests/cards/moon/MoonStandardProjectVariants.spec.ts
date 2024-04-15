import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProjectVariant2, MoonMineStandardProjectVariant2, MoonRoadStandardProjectVariant2} from '../../../src/server/cards/moon/MoonStandardProjectVariants';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {testRedsCosts} from '../../TestingUtils';

describe('MoonStandardProjectVariants', () => {
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
  });

  describe('MoonHabitatStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonHabitatStandardProjectVariant2();
      player.titanium = 1;
      player.megaCredits = 22;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 25;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 26;
      expect(player.canPlay(card)).is.true;
    });

    it('can act when Reds are in power', () => {
      const card = new MoonHabitatStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.habitatRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });

  describe('MoonMineStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonMineStandardProjectVariant2();
      player.titanium = 1;
      player.megaCredits = 20;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 22;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 23;
      expect(player.canPlay(card)).is.true;
    });

    it('can act when Reds are in power', () => {
      const card = new MoonMineStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.miningRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });

  describe('MoonRoadStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonRoadStandardProjectVariant2();
      player.titanium = 1;
      player.megaCredits = 18;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 20;
      expect(player.canPlay(card)).is.false;

      player.titanium = 0;
      player.megaCredits = 21;
      expect(player.canPlay(card)).is.true;
    });

    it('can act when Reds are in power', () => {
      const card = new MoonRoadStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.logisticRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });
});

