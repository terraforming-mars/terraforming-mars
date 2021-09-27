import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaHyperloopCorporation} from '../../../src/cards/moon/LunaHyperloopCorporation';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaHyperloopCorporation', () => {
  let player: Player;
  let card: LunaHyperloopCorporation;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    MoonExpansion.addColonyTile(player, spaces[3].id);
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
    MoonExpansion.addColonyTile(player, spaces[3].id);
    card.action(player);
    expect(card.getVictoryPoints(player)).eq(3);
  });
});

