import {expect} from 'chai';
import {Loan} from '../../../src/cards/prelude/Loan';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Loan', function() {
  let card: Loan;
  let player: Player;

  beforeEach(function() {
    card = new Loan();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.megaCredits).to.eq(30);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
  });
});
