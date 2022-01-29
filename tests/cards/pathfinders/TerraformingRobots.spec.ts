import {expect} from 'chai';
import {TerraformingRobots} from '../../../src/cards/pathfinders/TerraformingRobots';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TitanShuttles} from '../../../src/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/cards/pathfinders/MartianCulture';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';

describe('TerraformingRobots', function() {
  let card: TerraformingRobots;
  let player: TestPlayer;
  let game: Game;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let other: IProjectCard;

  beforeEach(function() {
    card = new TerraformingRobots();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    other = new MartianCulture();
    player.playedCards = [floater1, floater2, other];
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {science: 3};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 4};
    expect(player.canPlay(card)).is.true;
  });

  it('onCardPlayed', () => {
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, TestingUtils.fakeCard({}));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, TestingUtils.fakeCard({
      tags: [Tags.VENUS],
    }));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, TestingUtils.fakeCard({
      tags: [Tags.MARS],
    }));
    expect(card.resourceCount).eq(1);

    card.resourceCount = 0;
    card.onCardPlayed(player, TestingUtils.fakeCard({
      tags: [Tags.MARS, Tags.SCIENCE, Tags.MARS],
    }));
    expect(card.resourceCount).eq(2);
  });
});
