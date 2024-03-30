import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {SubterraneanHabitats} from '../../../src/server/cards/moon/SubterraneanHabitats';
import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {TheWomb} from '../../../src/server/cards/moon/TheWomb';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProject} from '../../../src/server/cards/moon/MoonHabitatStandardProject';

describe('SubterraneanHabitats', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: SubterraneanHabitats;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new SubterraneanHabitats();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.megacredits = 1000;

    player.stock.steel = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.stock.steel = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.stock.steel = 12;
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.stock.steel).eq(10);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(1);
  });

  it('effect', () => {
    // This test and the next show that The Womb needs 2 titanium.
    const theWomb = new TheWomb();
    player.production.override({energy: 2});
    player.stock.titanium = 2;
    player.stock.megacredits = 1000;

    player.cardsInHand = [theWomb];
    expect(player.getPlayableCards().map((card) => card.card.name)).deep.eq([CardName.THE_WOMB]);

    player.stock.titanium = 1;
    expect(player.getPlayableCards().map((card) => card.card.name)).is.empty;

    // And this one shows that with Subterranean Habitats, it needs one fewer unit of titanium.
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.card.name)).deep.eq([CardName.THE_WOMB]);
  });

  it('applies to colony standard project', () => {
    player.stock.titanium = 1;
    player.stock.megacredits = 1000;

    const projectCard = new MoonHabitatStandardProject();
    expect(projectCard.canAct(player)).is.true;

    player.stock.titanium = 0;
    expect(projectCard.canAct(player)).is.false;

    // And this one shows that with Subterranean Habitats, titanium isn't necessary
    player.playedCards = [card];
    expect(projectCard.canAct(player)).is.true;
  });
});
