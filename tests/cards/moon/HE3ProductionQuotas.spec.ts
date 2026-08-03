import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {HE3ProductionQuotas} from '../../../src/server/cards/moon/HE3ProductionQuotas';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';
import {PartyName} from '@/common/turmoil/PartyName';

describe('HE3ProductionQuotas', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: HE3ProductionQuotas;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    card = new HE3ProductionQuotas();
    moonData = MoonExpansion.moonData(game);
  });

  for (const run of [
    {party: PartyName.KELVINISTS, steel: 3, mines: 3, own: true, expected: true},
    {party: PartyName.KELVINISTS, steel: 2, mines: 3, own: true, expected: false},
    {party: PartyName.KELVINISTS, steel: 3, mines: 4, own: true, expected: false},
    {party: PartyName.KELVINISTS, steel: 3, mines: 3, own: false, expected: false},
    {party: PartyName.GREENS, steel: 3, mines: 3, own: true, expected: false},
  ] as const) {
    it('can play ' + JSON.stringify(run), () => {
      player.cardsInHand = [card];
      player.megaCredits = card.cost;
      game.turmoil!.rulingParty = game.turmoil!.getPartyByName(run.party)!;

      const spaces = moonData.moon.getAvailableSpacesOnLand(player);
      for (let i = 0; i < run.mines; i++) {
        spaces[i].tile = {tileType: TileType.MOON_MINE};
      }
      if (run.own) {
        spaces[0].player = player;
      }

      player.steel = run.steel;

      if (run.expected) {
        expect(player.getPlayableCards()).does.include(card);
      } else {
        expect(player.getPlayableCards()).does.not.include(card);
      }
    });
  }

  it('play', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    spaces[0].tile = {tileType: TileType.MOON_MINE};
    spaces[1].tile = {tileType: TileType.MOON_MINE};
    spaces[2].tile = {tileType: TileType.MOON_MINE};
    moonData.miningRate = 0;
    expect(player.terraformRating).eq(14);

    player.steel = 5;
    player.heat = 0;
    card.play(player);

    expect(player.steel).eq(2);
    expect(player.heat).eq(12);
    expect(moonData.miningRate).eq(1);
    expect(player.terraformRating).eq(15);
  });
});

