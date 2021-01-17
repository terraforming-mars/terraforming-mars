import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {SubterraneanHabitats} from '../../../src/cards/moon/SubterraneanHabitats';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/CardName';
import {Cards} from '../../../src/cards/Cards';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SubterraneanHabitats', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: SubterraneanHabitats;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new SubterraneanHabitats();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = 1000;

    player.steel = 1;
    expect(player.getPlayableCards()).does.not.include(card);
    player.steel = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 12;
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);

    expect(player.steel).eq(10);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.colonyRate).eq(1);
  });

  it('effect', () => {
    // This test and the next show that Mare Sernaitatis needs a steel and 2 titanium.
    player.titanium = 2;
    player.steel = 1;
    player.megaCredits = 1000;

    const msm = new MareSerenitatisMine();
    // FOR NOW ACTUALLY I'M HACKING THE CARD TO SAY THAT IS IS PLACING A COLONY
    msm.tilesBuilt.push(TileType.MOON_COLONY);
    player.cardsInHand = [msm];
    expect(player.getPlayableCards().map(Cards.toCardName)).deep.eq([CardName.MARE_SERENITATIS_MINE]);

    player.titanium = 1;
    player.steel = 1;
    expect(player.getPlayableCards().map(Cards.toCardName)).is.empty;

    // And this one shows that with Improved Moon Concrete, doesn't need steel.
    player.playedCards = [card];
    expect(player.getPlayableCards().map(Cards.toCardName)).deep.eq([CardName.MARE_SERENITATIS_MINE]);
  });
});
