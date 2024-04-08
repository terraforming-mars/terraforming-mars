import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {LunaFirstIncorporated} from '../../../src/server/cards/moon/LunaFirstIncorporated';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
describe('LunaFirstIncorporated', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let card: LunaFirstIncorporated;

  beforeEach(() => {
    [/* game */, player, otherPlayer] = testGame(2, {moonExpansion: true});
    card = new LunaFirstIncorporated();
  });

  it('effect', () => {
    card.play(player);

    // Case 1
    player.production.override({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseMiningRate(otherPlayer, 1);
    expect(player.megaCredits).eq(1);
    expect(player.production.megacredits).eq(0);

    // Case 2
    player.production.override({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseHabitatRate(otherPlayer, 2);
    expect(player.megaCredits).eq(2);
    expect(player.production.megacredits).eq(0);

    // Case 3
    player.production.override({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.megaCredits).eq(1);
    expect(player.production.megacredits).eq(1);

    // Case 4
    player.production.override({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseMiningRate(player, 2);
    expect(player.megaCredits).eq(2);
    expect(player.production.megacredits).eq(2);
  });
});

