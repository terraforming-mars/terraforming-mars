import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {LunaFirstIncorporated} from '../../../src/cards/moon/LunaFirstIncorporated';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaFirstIncorporated', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let card: LunaFirstIncorporated;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('id', [player, otherPlayer], player, MOON_OPTIONS);
    card = new LunaFirstIncorporated();
  });

  it('effect', () => {
    card.play(player);

    // Case 1
    player.setProductionForTest({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseMiningRate(otherPlayer, 1);
    expect(player.megaCredits).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    // Case 2
    player.setProductionForTest({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseColonyRate(otherPlayer, 2);
    expect(player.megaCredits).eq(2);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    // Case 3
    player.setProductionForTest({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.megaCredits).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    // Case 4
    player.setProductionForTest({megacredits: 0});
    player.megaCredits = 0;

    MoonExpansion.raiseMiningRate(player, 2);
    expect(player.megaCredits).eq(2);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });
});

