import {expect} from 'chai';
import {FloaterTechnology} from '../../../src/cards/colonies/FloaterTechnology';
import {ICard} from '../../../src/cards/ICard';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('FloaterTechnology', function() {
  let card : FloaterTechnology; let player : Player; let game : Game;

  beforeEach(function() {
    card = new FloaterTechnology();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', function() {
    const result = card.play();
    expect(result).is.undefined;
  });

  it('Can act without targets', function() {
    expect(card.canAct()).is.true;
    expect(card.action(player)).is.undefined;
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

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(1);
    expect(dirigibles.resourceCount).to.eq(0);
  });
});
