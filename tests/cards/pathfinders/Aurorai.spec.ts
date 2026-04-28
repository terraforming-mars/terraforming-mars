import {expect} from 'chai';
import {Aurorai} from '../../../src/server/cards/pathfinders/Aurorai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {Payment} from '../../../src/common/inputs/Payment';
import {CardName} from '../../../src/common/cards/CardName';

describe('Aurorai', () => {
  let card: Aurorai;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Aurorai();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('on TR bump', () => {
    expect(card.resourceCount).eq(0);
    player.increaseTerraformRating();
    runAllActions(game);
    expect(card.resourceCount).eq(1);

    player.increaseTerraformRating(3);
    runAllActions(game);
    expect(card.resourceCount).eq(4);
  });

  it('greenery standard project', () => {
    const greenery = new GreeneryStandardProject();
    expect(greenery.canAct(player)).is.false;

    player.megaCredits = 23;
    expect(greenery.canAct(player)).is.true;

    player.megaCredits = 20;
    expect(greenery.canAct(player)).is.false;

    card.resourceCount++;
    expect(greenery.canAct(player)).is.true;
  });

  it('paying for asteroid standard project', () => {
    const asteroid = new AsteroidStandardProject();
    expect(asteroid.canAct(player)).is.false;

    player.megaCredits = 10;
    card.resourceCount = 1;
    expect(asteroid.canAct(player)).is.false;

    card.resourceCount = 3;
    expect(asteroid.canAct(player)).is.true;

    const selectStandardProjectToPlay = new SelectStandardProjectToPlay(player, [asteroid]);

    expect(game.getTemperature()).eq(-30);
    expect(() =>
      selectStandardProjectToPlay.process({type: 'projectCard', card: CardName.ASTEROID_STANDARD_PROJECT, payment: {...Payment.EMPTY, megacredits: 4, auroraiData: 2}}),
    ).to.throw(/Did not spend enough/);

    selectStandardProjectToPlay.process({type: 'projectCard', card: CardName.ASTEROID_STANDARD_PROJECT, payment: {...Payment.EMPTY, megacredits: 8, auroraiData: 2}});
    expect(game.getTemperature()).eq(-28);
    expect(player.megaCredits).eq(2);
    expect(player.getSpendable('auroraiData')).eq(1);
  });
});
