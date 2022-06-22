import {expect} from 'chai';
import {JetStreamMicroscrappers} from '../../../src/cards/venusNext/JetStreamMicroscrappers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('JetStreamMicroscrappers', function() {
  let card : JetStreamMicroscrappers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new JetStreamMicroscrappers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.titanium = 2;

    // only one action possible
    expect(card.resourceCount).to.eq(0);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(1);

    // both actions possible
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
