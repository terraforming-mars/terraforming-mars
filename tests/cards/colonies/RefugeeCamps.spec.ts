import {expect} from 'chai';
import {RefugeeCamps} from '../../../src/cards/colonies/RefugeeCamps';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('RefugeeCamps', function() {
  let card : RefugeeCamps; let player : Player;

  beforeEach(function() {
    card = new RefugeeCamps();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;

    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(5);
  });

  it('Can\'t act', function() {
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
