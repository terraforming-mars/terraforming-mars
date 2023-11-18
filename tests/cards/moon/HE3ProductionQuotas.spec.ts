import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {HE3ProductionQuotas} from '../../../src/server/cards/moon/HE3ProductionQuotas';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';
import {Kelvinists} from '../../../src/server/turmoil/parties/Kelvinists';
import {Greens} from '../../../src/server/turmoil/parties/Greens';

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

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    game.turmoil!.rulingParty = new Kelvinists();

    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    spaces[0].tile = {tileType: TileType.MOON_MINE};
    spaces[1].tile = {tileType: TileType.MOON_MINE};
    spaces[2].tile = {tileType: TileType.MOON_MINE};

    player.steel = 3;
    expect(player.getPlayableCardsForTest()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCardsForTest()).does.not.include(card);


    game.turmoil!.rulingParty = new Kelvinists();
    player.steel = 2;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.steel = 3;
    spaces[3].tile = {tileType: TileType.MOON_MINE};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    spaces[0].tile = {tileType: TileType.MOON_MINE};
    spaces[1].tile = {tileType: TileType.MOON_MINE};
    spaces[2].tile = {tileType: TileType.MOON_MINE};
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    player.steel = 5;
    player.heat = 0;
    card.play(player);

    expect(player.steel).eq(2);
    expect(player.heat).eq(12);
    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

