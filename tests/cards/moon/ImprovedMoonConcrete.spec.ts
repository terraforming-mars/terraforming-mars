import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {ImprovedMoonConcrete} from '../../../src/cards/moon/ImprovedMoonConcrete';
import {expect} from 'chai';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';
import {CardName} from '../../../src/common/cards/CardName';
import {MoonMineStandardProject} from '../../../src/cards/moon/MoonMineStandardProject';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

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
