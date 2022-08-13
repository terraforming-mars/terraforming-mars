import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Virus} from '../../../src/server/cards/base/Virus';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Virus', function() {
  let card: Virus;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new Virus();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
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
    game = Game.newInstance('gameid', [player], player);
    expect(card.canPlay(player)).is.true;
    expect(card.play(player)).is.undefined;
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
