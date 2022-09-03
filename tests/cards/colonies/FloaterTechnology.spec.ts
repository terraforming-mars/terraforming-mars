import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {FloaterTechnology} from '../../../src/server/cards/colonies/FloaterTechnology';
import {ICard} from '../../../src/server/cards/ICard';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('FloaterTechnology', function() {
  let card: FloaterTechnology;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new FloaterTechnology();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can play', function() {
    const result = card.play(player);
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

    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(1);
    expect(dirigibles.resourceCount).to.eq(0);
  });
});
