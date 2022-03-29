import {expect} from 'chai';
import {Aurorai} from '../../../src/cards/pathfinders/Aurorai';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestingUtils} from '../../TestingUtils';
import {GreeneryStandardProject} from '../../../src/cards/base/standardProjects/GreeneryStandardProject';

describe('Aurorai', function() {
  let card: Aurorai;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Aurorai();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.corporationCard = card;
  });

  it('on TR bump', () => {
    expect(card.resourceCount).eq(0);
    player.increaseTerraformRating();
    TestingUtils.runAllActions(game);
    expect(card.resourceCount).eq(1);

    player.increaseTerraformRatingSteps(3);
    TestingUtils.runAllActions(game);
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
});
