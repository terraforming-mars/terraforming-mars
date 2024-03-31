import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {RobotPollinators} from '../../../src/server/cards/promo/RobotPollinators';
import {Game} from '../../../src/server/Game';
import {fakeCard, setOxygenLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';

describe('Robot Pollinators', function() {
  let card: RobotPollinators;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RobotPollinators();
    [game, player] = testGame(1);
  });


  it('Can not play if oxygen level too low', function() {
    setOxygenLevel(game, 1);
    expect(card.canPlay(player)).is.not.true;
    setOxygenLevel(game, 10);
    expect(card.canPlay(player)).is.true;
  });

  it('Play, No tags', function() {
    // Sanity
    setOxygenLevel(game, 10);
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
    setOxygenLevel(game, 10);
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
