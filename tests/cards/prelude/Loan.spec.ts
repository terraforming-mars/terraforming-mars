import {expect} from 'chai';
import {Loan} from '../../../src/server/cards/prelude/Loan';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('Loan', function() {
  let card: Loan;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Loan();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    player.production.add(Resource.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.megaCredits).to.eq(30);
    expect(player.production.megacredits).to.eq(-2);
  });
});
