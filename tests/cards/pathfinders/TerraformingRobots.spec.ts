import {expect} from 'chai';
import {TerraformingRobots} from '../../../src/server/cards/pathfinders/TerraformingRobots';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

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

    card.onCardPlayed(player, fakeCard({}));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, fakeCard({
      tags: [Tag.VENUS],
    }));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, fakeCard({
      tags: [Tag.MARS],
    }));
    expect(card.resourceCount).eq(1);

    card.resourceCount = 0;
    card.onCardPlayed(player, fakeCard({
      tags: [Tag.MARS, Tag.SCIENCE, Tag.MARS],
    }));
    expect(card.resourceCount).eq(2);
  });
});
