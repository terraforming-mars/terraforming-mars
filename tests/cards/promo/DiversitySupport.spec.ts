import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {DiversitySupport} from '../../../src/server/cards/promo/DiversitySupport';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('DiversitySupport', function() {
  let card: DiversitySupport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DiversitySupport();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play', function() {
    // 3 non-standard resources
    const ants = new Ants();
    const fish = new Fish();
    const dirigibles = new Dirigibles();
    player.playedCards.push(ants, fish, dirigibles);
    dirigibles.resourceCount = 4;
    fish.resourceCount = 3;
    ants.resourceCount = 2;
    expect(player.simpleCanPlay(card)).is.not.true;

    // 6 standard resources
    player.megaCredits = 10;
    player.steel = 2;
    player.titanium = 1;
    player.plants = 4;
    player.energy = 1;
    player.heat = 3;

    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
