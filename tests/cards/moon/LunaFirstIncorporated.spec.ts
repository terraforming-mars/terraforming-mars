import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {LunaFirstIncorporated} from '../../../src/server/cards/moon/LunaFirstIncorporated';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
describe('LunaFirstIncorporated', () => {
  let player: TestPlayer;
  let game: IGame;
  let otherPlayer: TestPlayer;
  let card: LunaFirstIncorporated;

  beforeEach(() => {
    [game, player, otherPlayer] = testGame(2, {moonExpansion: true});
    card = new LunaFirstIncorporated();
    card.play(player);
  });

  it('effect, mining rate, other player', () => {
    MoonExpansion.raiseMiningRate(otherPlayer, 1);
    expect(player.megaCredits).eq(1);
    expect(player.production.megacredits).eq(0);
  });

  it('effect, habitat rate, other player', () => {
    MoonExpansion.raiseHabitatRate(otherPlayer, 2);
    expect(player.megaCredits).eq(2);
    expect(player.production.megacredits).eq(0);
  });

  it('effect, logistic rate, other player', () => {
    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.megaCredits).eq(1);
    expect(player.production.megacredits).eq(1);
  });

  it('effect, mining rate, self', () => {
    MoonExpansion.raiseMiningRate(player, 2);
    expect(player.megaCredits).eq(2);
    expect(player.production.megacredits).eq(2);
  });

  it('effect, near max', () => {
    game.moonData!.habitatRate = 7;
    MoonExpansion.raiseHabitatRate(player, 2);
    expect(player.megaCredits).eq(1);
    expect(player.production.megacredits).eq(1);
  });

  it('effect, at max', () => {
    game.moonData!.habitatRate = 8;
    MoonExpansion.raiseHabitatRate(player, 1);
    expect(player.megaCredits).eq(0);
    expect(player.production.megacredits).eq(0);
  });
});

