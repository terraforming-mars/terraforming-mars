import {expect} from 'chai';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {Pets} from '../../../src/cards/base/Pets';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MarsUniversity', function() {
  let card : MarsUniversity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MarsUniversity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;

    expect(card.onCardPlayed(player, game, new Pets())).is.undefined;
    expect(game.deferredActions).has.lengthOf(0);

    player.cardsInHand.push(card);
    card.onCardPlayed(player, game, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[0].cb([card]);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).not.to.eq(card);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(game.dealer.discarded[0]).to.eq(card);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Gives victory point', function() {
    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });

  it('Runs twice for multiple science tags', function() {
    player.cardsInHand.push(card, card);
    card.onCardPlayed(player, game, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[1].cb();

    const orOptions2 = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions2.options[1].cb();

    expect(game.deferredActions).has.lengthOf(0);
  });
});
