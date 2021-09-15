import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {expect} from 'chai';
import {MoonColonyStandardProjectVariant2, MoonMineStandardProjectVariant2, MoonRoadStandardProjectVariant2} from '../../../src/cards/moon/MoonStandardProjectVariants';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MoonStandardProjectVariants', () => {
  let player: Player;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
  });

  describe('MoonColonyStandardProjectVariant2', () => {
    it('can act', () => {
      const card = new MoonColonyStandardProjectVariant2();
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
  });
});

