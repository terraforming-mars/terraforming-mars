import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {SubterraneanHabitats} from '../../../src/server/cards/moon/SubterraneanHabitats';
import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProject} from '../../../src/server/cards/moon/MoonHabitatStandardProject';
import {newCard} from '../../../src/server/createCard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';

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
    player.megaCredits = 1000;

    player.steel = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.steel = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.steel = 12;
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.steel).eq(10);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(1);
  });

  const effectRuns = [
    {card: CardName.THE_WOMB, titanium: 2, played: false, expected: true},
    {card: CardName.THE_WOMB, titanium: 1, played: false, expected: false},
    {card: CardName.THE_WOMB, titanium: 1, played: true, expected: true},
    {card: CardName.MOMENTUM_VIRUM_HABITAT, titanium: 1, played: false, expected: true},
    {card: CardName.MOMENTUM_VIRUM_HABITAT, titanium: 0, played: false, expected: false},
    {card: CardName.MOMENTUM_VIRUM_HABITAT, titanium: 0, played: true, expected: false},
  ];
  for (const run of effectRuns) {
    it('effect ' + JSON.stringify(run), () => {
      const cardUnderTest = newCard(run.card) as IProjectCard;
      player.cardsInHand = [cardUnderTest];

      player.production.override({energy: 2}); // For The Womb
      player.titanium = run.titanium;
      player.megaCredits = 1000;
      if (run.played) {
        player.playedCards.push(card);
      }

      if (run.expected) {
        expect(player.getPlayableCards().map((card) => card.card.name)).deep.eq([run.card]);
      } else {
        expect(player.getPlayableCards().map((card) => card.card.name)).is.empty;
      }
    });
  }

  it('applies to colony standard project', () => {
    player.titanium = 1;
    player.megaCredits = 1000;

    const projectCard = new MoonHabitatStandardProject();
    expect(projectCard.canAct(player)).is.true;

    player.titanium = 0;
    expect(projectCard.canAct(player)).is.false;

    // And this one shows that with Subterranean Habitats, titanium isn't necessary
    player.playedCards.push(card);
    expect(projectCard.canAct(player)).is.true;
  });
});
