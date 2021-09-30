import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {HE3ProductionQuotas} from '../../../src/cards/moon/HE3ProductionQuotas';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/TileType';
import {Kelvinists} from '../../../src/turmoil/parties/Kelvinists';
import {Greens} from '../../../src/turmoil/parties/Greens';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HE3ProductionQuotas', () => {
  let player: Player;
  let game: Game;
  let card: HE3ProductionQuotas;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    expect(player.getPlayableCards()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCards()).does.not.include(card);


    game.turmoil!.rulingParty = new Kelvinists();
    player.steel = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 3;
    spaces[3].tile = {tileType: TileType.MOON_MINE};
    expect(player.getPlayableCards()).does.not.include(card);
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

