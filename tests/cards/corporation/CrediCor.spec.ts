import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {GiantIceAsteroid} from '../../../src/cards/base/GiantIceAsteroid';
import {AsteroidStandardProject} from '../../../src/cards/base/standardProjects/AsteroidStandardProject';
import {CityStandardProject} from '../../../src/cards/base/standardProjects/CityStandardProject';
import {GreeneryStandardProject} from '../../../src/cards/base/standardProjects/GreeneryStandardProject';
import {CrediCor} from '../../../src/cards/corporation/CrediCor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('CrediCor', function() {
  let card : CrediCor; let player : Player;

  beforeEach(function() {
    card = new CrediCor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
    player.corporationCard = card;
    card.onStandardProject(player, new AsteroidStandardProject());
    card.onStandardProject(player, new CityStandardProject());
    card.onStandardProject(player, new GreeneryStandardProject());
    expect(player.megaCredits).to.eq(8);
  });

  it('Runs onCardPlayed', function() {
    player.corporationCard = card;
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, new GiantIceAsteroid());
    expect(player.megaCredits).to.eq(4);
    card.onCardPlayed(player, new Bushes());
    expect(player.megaCredits).to.eq(4);
  });
});
