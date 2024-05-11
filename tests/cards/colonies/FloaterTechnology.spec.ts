import {expect} from 'chai';
import {churnAction, cast} from '../../TestingUtils';
import {FloaterTechnology} from '../../../src/server/cards/colonies/FloaterTechnology';
import {ICard} from '../../../src/server/cards/ICard';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('FloaterTechnology', function() {
  let card: FloaterTechnology;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new FloaterTechnology();
    [game, player] = testGame(2);
  });

  it('Can play', function() {
    const result = card.play(player);
    expect(result).is.undefined;
  });

  it('Can act without targets', function() {
    expect(card.canAct(player)).is.true;
    expect(churnAction(card, player)).is.undefined;
  });

  it('Acts automatically with single targets', function() {
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(dirigibles.resourceCount).to.eq(1);
  });

  it('Should act with multiple targets', function() {
    const dirigibles = new Dirigibles();
    const floatingHabs = new FloatingHabs();
    player.playedCards.push(dirigibles, floatingHabs);

    const selectCard = cast(churnAction(card, player), SelectCard<ICard>);
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(1);
    expect(dirigibles.resourceCount).to.eq(0);
  });
});
