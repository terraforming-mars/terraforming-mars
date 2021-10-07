import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Fish} from '../../../src/cards/base/Fish';
import {DiversitySupport} from '../../../src/cards/promo/DiversitySupport';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('DiversitySupport', function() {
  let card : DiversitySupport; let player : Player;

  beforeEach(function() {
    card = new DiversitySupport();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
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
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    // 6 standard resources
    player.megaCredits = 10;
    player.steel = 2;
    player.titanium = 1;
    player.plants = 4;
    player.energy = 1;
    player.heat = 3;

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
