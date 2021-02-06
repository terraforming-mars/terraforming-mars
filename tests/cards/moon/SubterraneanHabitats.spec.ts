import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {setCustomGameOptions} from '../../TestingUtils';
import {SubterraneanHabitats} from '../../../src/cards/moon/SubterraneanHabitats';
import {expect} from 'chai';
import {CardName} from '../../../src/CardName';
import {TheWomb} from '../../../src/cards/moon/TheWomb';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SubterraneanHabitats', () => {
  let game: Game;
  let player: TestPlayer;
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
    // This test and the next show that The Womb needs 2 titanium.
    const theWomb = new TheWomb();
    player.setProductionForTest({energy: 2});
    player.titanium = 2;
    player.megaCredits = 1000;

    player.cardsInHand = [theWomb];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.THE_WOMB]);

    player.titanium = 1;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Subterranean Habitats, it doesn't need both titanium.
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.THE_WOMB]);
  });
});
