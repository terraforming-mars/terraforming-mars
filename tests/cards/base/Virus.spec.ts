import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Virus} from '../../../src/server/cards/base/Virus';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Virus', function() {
  let card: Virus;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new Virus();
    [/* game */, player, player2] = testGame(2);
  });

  it('Should play', function() {
    const birds = new Birds();
    const predators = new Predators();
    player.playedCards.push(birds, predators);
    player.addResourceTo(birds);
    player.addResourceTo(predators);
    player.plants = 5;

    const orOptions = cast(card.play(player2), OrOptions);

    orOptions.options[0].cb([player.playedCards[0]]);
    expect(birds.resourceCount).to.eq(0);

    orOptions.options[1].cb();
    expect(player.plants).to.eq(0);
  });

  it('Can play when no other player has resources', function() {
    player.plants = 5;
    expect(card.play(player)).is.undefined;
    expect(player.plants).to.eq(5);
  });

  it('Works in solo mode', function() {
    const [game, player] = testGame(1);
    expect(card.canPlay(player)).is.true;
    expect(card.play(player)).is.undefined;
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
