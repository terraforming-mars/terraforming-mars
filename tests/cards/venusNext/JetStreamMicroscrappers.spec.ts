import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('JetStreamMicroscrappers', function() {
  let card: JetStreamMicroscrappers;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new JetStreamMicroscrappers();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
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
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
