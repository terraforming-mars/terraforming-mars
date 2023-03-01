import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {RobotPollinators} from '../../../src/server/cards/promo/RobotPollinators';
import {Game} from '../../../src/server/Game';
import {fakeCard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';

describe('Robot Pollinators', function() {
  let card: RobotPollinators;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RobotPollinators();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });


  it('Can not play if oxygen level too low', function() {
    (game as any).oxygenLevel = 1;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    (game as any).oxygenLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Play, No tags', function() {
    // Sanity
    (game as any).oxygenLevel = 10;
    expect(player.production.plants).to.eq(0);
    expect(player.plants).to.eq(0);

    // Play
    card.play(player);
    player.playedCards.push(card);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(0);
  });

  it('Play, Yes tags', function() {
    // Sanity
    (game as any).oxygenLevel = 10;
    expect(player.production.plants).to.eq(0);
    expect(player.plants).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.PLANT, Tag.PLANT, Tag.PLANT]}));
    // Play
    card.play(player);
    player.playedCards.push(card);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(3);
  });
});
