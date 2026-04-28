import {expect} from 'chai';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {StandardTechnology} from '../../../src/server/cards/underworld/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {Payment} from '../../../src/common/inputs/Payment';
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
    asteroidStandardProject = new AsteroidStandardProject();
  });

  it('canAct', () => {
    player.playedCards.push(card);

    expect(card.canAct(player)).is.false;

    expect(asteroidStandardProject.canAct(player)).is.false;
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).is.true;

    asteroidStandardProject.payAndExecute(player, Payment.of({megacredits: 14}));
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

  it('Works for standard projects taken before Standard Technology was played', () => {
    player.megaCredits = 14;
    asteroidStandardProject.payAndExecute(player, Payment.of({megacredits: 14}));
    runAllActions(game);
    expect(player.megaCredits).eq(0);

    // Second play is discounted
    player.megaCredits = 6;

    expect(card.canAct(player)).is.false;

    player.playedCards.push(card);

    expect(card.canAct(player)).is.true;

    // Next generation
    forceGenerationEnd(game);
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    player.playedCards.push(card);
    player.standardProjectsThisGeneration.add(CardName.ASTEROID_STANDARD_PROJECT);
    player.standardProjectsThisGeneration.add(CardName.AQUIFER_STANDARD_PROJECT);
    player.megaCredits = 9;

    expect(card.canAct(player)).is.true;

    const selectStandardProjectToPlay = cast(card.action(player), SelectStandardProjectToPlay);
    expect((selectStandardProjectToPlay.cards.map(toName))).deep.eq([CardName.ASTEROID_STANDARD_PROJECT]);

    player.megaCredits = 10;

    const selectStandardProjectToPlay2 = cast(card.action(player), SelectStandardProjectToPlay);
    expect((selectStandardProjectToPlay2.cards.map(toName))).deep.eq([CardName.ASTEROID_STANDARD_PROJECT, CardName.AQUIFER_STANDARD_PROJECT]);

    expect(player.terraformRating).eq(14);

    selectStandardProjectToPlay2.payAndPlay(selectStandardProjectToPlay2.cards[0], Payment.of({megacredits: 6}));
    runAllActions(game);

    expect(player.megaCredits).eq(4);
    expect(game.getTemperature()).eq(-28);
    expect(player.terraformRating).eq(15);
  });
});
