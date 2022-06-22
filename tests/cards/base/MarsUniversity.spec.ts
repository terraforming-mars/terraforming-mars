import {expect} from 'chai';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {Pets} from '../../../src/cards/base/Pets';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('MarsUniversity', function() {
  let card : MarsUniversity; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new MarsUniversity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;

    expect(card.onCardPlayed(player, new Pets())).is.undefined;
    expect(game.deferredActions).has.lengthOf(0);

    player.cardsInHand.push(card);
    card.onCardPlayed(player, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions.options[0].cb([card]);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).not.to.eq(card);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(game.dealer.discarded[0]).to.eq(card);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Gives victory point', function() {
    card.play();
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Runs twice for multiple science tags', function() {
    player.cardsInHand.push(card, card);
    card.onCardPlayed(player, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions.options[1].cb();

    const orOptions2 = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions2.options[1].cb();

    expect(game.deferredActions).has.lengthOf(0);
  });
});
