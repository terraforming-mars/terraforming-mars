import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {UndermoonDrugLordsNetwork} from '../../../src/cards/moon/UndermoonDrugLordsNetwork';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('UndermoonDrugLordsNetwork', () => {
  let player: TestPlayer;
  let card: UndermoonDrugLordsNetwork;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new UndermoonDrugLordsNetwork();
  });

  it('play', () => {
    const moonData = MoonExpansion.moonData(player.game);

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 0;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 1;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 2;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 3;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 4;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });
});

