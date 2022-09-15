import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {ImprovedMoonConcrete} from '../../../src/server/cards/moon/ImprovedMoonConcrete';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/server/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/common/cards/CardName';
import {MoonMineStandardProject} from '../../../src/server/cards/moon/MoonMineStandardProject';

describe('ImprovedMoonConcrete', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: ImprovedMoonConcrete;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
    player.titanium = 2;
    player.steel = 1;
    player.megaCredits = 1000;

    const msm = new MareSerenitatisMine();
    player.cardsInHand = [msm];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);

    player.titanium = 1;
    player.steel = 1;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Improved Moon Concrete, titanium isn't necessary
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);
  });

  it('applies to mine standard project', () => {
    player.titanium = 1;
    player.megaCredits = 1000;

    const projectCard = new MoonMineStandardProject();
    expect(projectCard.canAct(player)).is.true;

    player.titanium = 0;
    expect(projectCard.canAct(player)).is.false;

    // And this one shows that with Improved Moon Concrete, titanium isn't necessary
    player.playedCards = [card];
    expect(projectCard.canAct(player)).is.true;
  });
});
