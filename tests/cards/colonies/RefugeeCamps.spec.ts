import {expect} from 'chai';
import {RefugeeCamps} from '../../../src/server/cards/colonies/RefugeeCamps';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '../../TestingUtils';

describe('RefugeeCamps', () => {
  let card: RefugeeCamps;
  let player: TestPlayer;

  beforeEach(() => {
    card = new RefugeeCamps();
    [/* game */, player] = testGame(1);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints(player)).to.eq(5);
  });

  it('Can not act', () => {
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(1);
  });
});
