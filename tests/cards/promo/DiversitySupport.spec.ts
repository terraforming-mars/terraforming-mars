import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {DiversitySupport} from '../../../src/server/cards/promo/DiversitySupport';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('DiversitySupport', () => {
  let card: DiversitySupport;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DiversitySupport();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    // 3 non-standard resources
    const ants = new Ants();
    const fish = new Fish();
    const dirigibles = new Dirigibles();
    player.playedCards.push(ants, fish, dirigibles);
    dirigibles.resourceCount = 4;
    fish.resourceCount = 3;
    ants.resourceCount = 2;
    expect(card.canPlay(player)).is.not.true;

    // 6 standard resources
    player.megaCredits = 10;
    player.steel = 2;
    player.titanium = 1;
    player.plants = 4;
    player.energy = 1;
    player.heat = 3;

    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
