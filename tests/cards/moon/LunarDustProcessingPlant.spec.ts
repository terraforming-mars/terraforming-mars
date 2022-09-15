import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarDustProcessingPlant} from '../../../src/server/cards/moon/LunarDustProcessingPlant';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/server/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/common/cards/CardName';
import {MoonRoadStandardProject} from '../../../src/server/cards/moon/MoonRoadStandardProject';

describe('LunarDustProcessingPlant', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunarDustProcessingPlant;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
