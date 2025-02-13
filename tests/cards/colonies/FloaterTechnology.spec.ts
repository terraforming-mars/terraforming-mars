import {expect} from 'chai';
import {churn, cast} from '../../TestingUtils';
import {FloaterTechnology} from '../../../src/server/cards/colonies/FloaterTechnology';
import {ICard} from '../../../src/server/cards/ICard';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('FloaterTechnology', () => {
  let card: FloaterTechnology;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new FloaterTechnology();
    [game, player] = testGame(2);
  });

  it('Can play', () => {
    const result = card.play(player);
    expect(result).is.undefined;
  });

  it('Can act without targets', () => {
    expect(card.canAct(player)).is.true;
    expect(churn(card.action(player), player)).is.undefined;
  });

  it('Acts automatically with single targets', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(dirigibles.resourceCount).to.eq(1);
  });

  it('Should act with multiple targets', () => {
    const dirigibles = new Dirigibles();
    const floatingHabs = new FloatingHabs();
    player.playedCards.push(dirigibles, floatingHabs);

    const selectCard = cast(churn(card.action(player), player), SelectCard<ICard>);
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(1);
    expect(dirigibles.resourceCount).to.eq(0);
  });
});
