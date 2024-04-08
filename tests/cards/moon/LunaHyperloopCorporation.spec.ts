import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunaHyperloopCorporation} from '../../../src/server/cards/moon/LunaHyperloopCorporation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('LunaHyperloopCorporation', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: LunaHyperloopCorporation;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
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
    player.playedCards.push(card);
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

