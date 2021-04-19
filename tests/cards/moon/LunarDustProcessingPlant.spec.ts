import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunarDustProcessingPlant} from '../../../src/cards/moon/LunarDustProcessingPlant';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/CardName';
import {MoonRoadStandardProject} from '../../../src/cards/moon/MoonRoadStandardProject';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarDustProcessingPlant', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunarDustProcessingPlant;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunarDustProcessingPlant();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.logisticRate).eq(1);
  });

  it('effect', () => {
    // This test and the next show that Mare Sernaitatis needs a steel and titanium.
    player.titanium = 2;
    player.steel = 1;
    player.megaCredits = 1000;

    player.cardsInHand = [new MareSerenitatisMine()];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);

    player.titanium = 2;
    player.steel = 0;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Lunar Dust Processing Plant, steel isn't necessary
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);
  });

  it('applies to road standard project', () => {
    player.steel = 1;
    player.megaCredits = 1000;

    const projectCard = new MoonRoadStandardProject();
    expect(projectCard.canAct(player)).is.true;

    player.steel = 0;
    expect(projectCard.canAct(player)).is.false;

    // And this one shows that with Lunar Dust Processing Plant, steel isn't necessary
    player.playedCards = [card];
    expect(projectCard.canAct(player)).is.true;
  });
});
