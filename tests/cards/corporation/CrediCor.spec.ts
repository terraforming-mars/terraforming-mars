import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {GiantIceAsteroid} from '../../../src/server/cards/base/GiantIceAsteroid';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {CityStandardProject} from '../../../src/server/cards/base/standardProjects/CityStandardProject';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {CrediCor} from '../../../src/server/cards/corporation/CrediCor';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('CrediCor', function() {
  let card: CrediCor;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CrediCor();
    [/* game */, player] = testGame(2);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
    player.setCorporationForTest(card);
    card.onStandardProject(player, new AsteroidStandardProject());
    card.onStandardProject(player, new CityStandardProject());
    card.onStandardProject(player, new GreeneryStandardProject());
    expect(player.megaCredits).to.eq(8);
  });

  it('Runs onCardPlayed', function() {
    player.setCorporationForTest(card);
    expect(player.megaCredits).to.eq(0);
    card.onCardPlayed(player, new GiantIceAsteroid());
    expect(player.megaCredits).to.eq(4);
    card.onCardPlayed(player, new Bushes());
    expect(player.megaCredits).to.eq(4);
  });
});
