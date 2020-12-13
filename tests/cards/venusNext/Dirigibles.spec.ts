import {expect} from 'chai';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Dirigibles', function() {
  let card : Dirigibles; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Dirigibles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - single target', function() {
    const action = card.action(player, game);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new FloatingHabs());
    const action = card.action(player, game);
    expect(action instanceof SelectCard).is.true;

        action!.cb([card]);
        expect(card.resourceCount).to.eq(1);
  });
});
