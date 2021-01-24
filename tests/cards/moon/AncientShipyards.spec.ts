import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {AncientShipyards} from '../../../src/cards/moon/AncientShipyards';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {MoonSpaces} from '../../../src/moon/MoonSpaces';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('AncientShipyards', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: AncientShipyards;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new AncientShipyards();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 2;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 3;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.getProduction(Resources.STEEL)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareNectaris = moonData.moon.getSpace(MoonSpaces.MARE_NECTARIS);
    expect(mareNectaris.player).eq(player);
    expect(mareNectaris.tile!.tileType).eq(TileType.MOON_MINE);
  });

  it('victory points', () => {
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(2);
  });
});

