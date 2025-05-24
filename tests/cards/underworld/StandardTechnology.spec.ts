import {expect} from 'chai';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {StandardTechnology} from '../../../src/server/cards/underworld/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {toName} from '../../../src/common/utils/utils';
import {CardName} from '../../../src/common/cards/CardName';

describe('Underworld / StandardTechnology', () => {
  let card: StandardTechnology;
  let game: IGame;
  let player: TestPlayer;
  let asteroidStandardProject: AsteroidStandardProject;

  beforeEach(() => {
    card = new StandardTechnology();
    [game, player] = testGame(1);
    player.playedCards.push(card);
    asteroidStandardProject = new AsteroidStandardProject();
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;

    expect(asteroidStandardProject.canAct(player)).is.false;
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).is.true;

    asteroidStandardProject.action(player);
    runAllActions(game);
    expect(player.megaCredits).eq(0);

    expect(card.canAct(player)).is.false;

    // Second play is discounted
    player.megaCredits = 5;
    expect(asteroidStandardProject.canAct(player)).is.false;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 6;
    expect(asteroidStandardProject.canAct(player)).is.false;
    expect(card.canAct(player)).is.true;

    // Next generation
    forceGenerationEnd(game);
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    card.data.projects.push(CardName.ASTEROID_STANDARD_PROJECT, CardName.AQUIFER_STANDARD_PROJECT);
    player.megaCredits = 9;

    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard);
    expect((selectCard.cards.map(toName))).deep.eq([CardName.ASTEROID_STANDARD_PROJECT]);

    player.megaCredits = 10;

    const selectCard2 = cast(card.action(player), SelectCard);
    expect((selectCard2.cards.map(toName))).deep.eq([CardName.ASTEROID_STANDARD_PROJECT, CardName.AQUIFER_STANDARD_PROJECT]);

    expect(player.getTerraformRating()).eq(14);

    selectCard2.cb([selectCard2.cards[0]]);
    runAllActions(game);

    expect(player.megaCredits).eq(4);
    expect(game.getTemperature()).eq(-28);
    expect(player.getTerraformRating()).eq(15);
  });
});
