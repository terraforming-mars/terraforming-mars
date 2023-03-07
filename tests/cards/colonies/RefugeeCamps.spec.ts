import {expect} from 'chai';
import {RefugeeCamps} from '../../../src/server/cards/colonies/RefugeeCamps';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('RefugeeCamps', function() {
  let card: RefugeeCamps;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RefugeeCamps();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;

    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(5);
  });

  it('Can not act', function() {
    player.production.add(Resources.MEGACREDITS, -5);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(1);
  });
});
