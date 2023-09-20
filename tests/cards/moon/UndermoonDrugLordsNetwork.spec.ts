import {UndermoonDrugLordsNetwork} from '../../../src/server/cards/moon/UndermoonDrugLordsNetwork';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('UndermoonDrugLordsNetwork', () => {
  let player: TestPlayer;
  let card: UndermoonDrugLordsNetwork;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, {moonExpansion: true});
    card = new UndermoonDrugLordsNetwork();
  });

  it('play', () => {
    const moonData = MoonExpansion.moonData(player.game);

    player.production.override({megacredits: 0});
    moonData.habitatRate = 0;
    card.play(player);
    expect(player.production.megacredits).eq(0);

    player.production.override({megacredits: 0});
    moonData.habitatRate = 1;
    card.play(player);
    expect(player.production.megacredits).eq(0);

    player.production.override({megacredits: 0});
    moonData.habitatRate = 2;
    card.play(player);
    expect(player.production.megacredits).eq(1);

    player.production.override({megacredits: 0});
    moonData.habitatRate = 3;
    card.play(player);
    expect(player.production.megacredits).eq(1);

    player.production.override({megacredits: 0});
    moonData.habitatRate = 4;
    card.play(player);
    expect(player.production.megacredits).eq(2);
  });
});
