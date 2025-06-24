import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {NewColonyPlanningInitiatives} from '../../../src/server/cards/moon/NewColonyPlanningInitiatives';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('NewColonyPlanningInitiatives', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: NewColonyPlanningInitiatives;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new NewColonyPlanningInitiatives();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.habitatRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    moonData.habitatRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    moonData.habitatRate = 2;
    expect(player.terraformRating).eq(14);

    card.play(player);

    expect(player.terraformRating).eq(15);
    expect(moonData.habitatRate).eq(3);
  });
});

