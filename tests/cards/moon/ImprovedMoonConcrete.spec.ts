import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {ImprovedMoonConcrete} from '../../../src/cards/moon/ImprovedMoonConcrete';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/CardName';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ImprovedMoonConcrete', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: ImprovedMoonConcrete;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new ImprovedMoonConcrete();
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
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.steel).eq(10);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);
  });

  it('effect', () => {
    // This test and the next show that Mare Sernaitatis needs a steel and 2 titanium.
    // BUT FOR NOW ACTUALLY I'M HACKING THE CARD TO NEED 2 STEEL
    player.titanium = 2;
    player.steel = 2;
    player.megaCredits = 1000;

    const msm = new MareSerenitatisMine();
    // TODO(kberg): Find an example that needs 2 steel. For now, hack this card to need 2 steel.
    msm.reserveUnits.steel = 2;
    player.cardsInHand = [msm];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);

    player.titanium = 2;
    player.steel = 1;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Improved Moon Concrete, doesn't need steel.
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);
  });
});
