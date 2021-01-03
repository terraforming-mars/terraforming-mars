import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {GiantIceAsteroid} from '../../../src/cards/base/GiantIceAsteroid';
import {CrediCor} from '../../../src/cards/corporation/CrediCor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';
import {AsteroidStandard} from '../../../src/cards/standardProjects/Asteroid';
import {City} from '../../../src/cards/standardProjects/City';
import {Greenery} from '../../../src/cards/standardProjects/Greenery';

describe('CrediCor', function() {
  let card : CrediCor; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CrediCor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
    player.corporationCard = card;
    card.onStandardProject(player, new AsteroidStandard());
    card.onStandardProject(player, new City());
    card.onStandardProject(player, new Greenery());
    expect(player.megaCredits).to.eq(8);
  });

  it('Runs onCardPlayed', function() {
    player.corporationCard = card;
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, game, new GiantIceAsteroid());
    expect(player.megaCredits).to.eq(4);
    card.onCardPlayed(player, game, new Bushes());
    expect(player.megaCredits).to.eq(4);
  });
});
