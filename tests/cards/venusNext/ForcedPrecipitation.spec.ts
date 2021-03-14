import {expect} from 'chai';
import {ForcedPrecipitation} from '../../../src/cards/venusNext/ForcedPrecipitation';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ForcedPrecipitation', function() {
  let card : ForcedPrecipitation; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ForcedPrecipitation();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - both actions available', function() {
    player.playedCards.push(card);
    player.megaCredits = 10;

    const action = card.action(player);
    game.deferredActions.runNext();
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);

    player.addResourceTo(card);
    expect(card.resourceCount).to.eq(2);

    const orOptions2 = card.action(player) as OrOptions;
    expect(orOptions2 instanceof OrOptions).is.true;
    orOptions2.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should act - only one action available', function() {
    player.playedCards.push(card);
    player.megaCredits = 0;
    player.addResourceTo(card, 2);

    card.action(player);
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
