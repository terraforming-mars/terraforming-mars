import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProjectVariant2, MoonMineStandardProjectVariant2, MoonRoadStandardProjectVariant2} from '../../../src/server/cards/moon/MoonStandardProjectVariants';

describe('MoonStandardProjectVariants', () => {
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
  });

  describe('MoonHabitatStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonHabitatStandardProjectVariant2();
      player.stock.titanium = 1;
      player.stock.megacredits = 22;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 25;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 26;
      expect(player.canPlay(card)).is.true;
    });
  });

  describe('MoonMineStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonMineStandardProjectVariant2();
      player.stock.titanium = 1;
      player.stock.megacredits = 20;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 22;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 23;
      expect(player.canPlay(card)).is.true;
    });
  });

  describe('MoonRoadStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonRoadStandardProjectVariant2();
      player.stock.titanium = 1;
      player.stock.megacredits = 18;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 20;
      expect(player.canPlay(card)).is.false;

      player.stock.titanium = 0;
      player.stock.megacredits = 21;
      expect(player.canPlay(card)).is.true;
    });
  });
});

