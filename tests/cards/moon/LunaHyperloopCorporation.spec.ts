import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaHyperloopCorporation} from '../../../src/server/cards/moon/LunaHyperloopCorporation';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('LunaHyperloopCorporation', () => {
  let player: Player;
  let card: LunaHyperloopCorporation;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LunaHyperloopCorporation();
    moonData = MoonExpansion.moonData(game);
  });

  it('action', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[0].id);
    card.action(player);
    expect(player.megaCredits).eq(1);

    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[1].id);
    card.action(player);
    expect(player.megaCredits).eq(2);

    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[2].id);
    card.action(player);
    expect(player.megaCredits).eq(3);

    player.megaCredits = 0;
    MoonExpansion.addHabitatTile(player, spaces[3].id);
    card.action(player);
    expect(player.megaCredits).eq(3);
  });

  it('victory points', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[0].id);
    card.action(player);
    expect(card.getVictoryPoints(player)).eq(1);

    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[1].id);
    card.action(player);
    expect(card.getVictoryPoints(player)).eq(2);

    player.megaCredits = 0;
    MoonExpansion.addRoadTile(player, spaces[2].id);
    card.action(player);
    expect(card.getVictoryPoints(player)).eq(3);

    player.megaCredits = 0;
    MoonExpansion.addHabitatTile(player, spaces[3].id);
    card.action(player);
    expect(card.getVictoryPoints(player)).eq(3);
  });
});

