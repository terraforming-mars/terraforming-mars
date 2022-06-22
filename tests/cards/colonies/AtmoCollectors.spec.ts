import {expect} from 'chai';
import {AtmoCollectors} from '../../../src/cards/colonies/AtmoCollectors';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('AtmoCollectors', function() {
  let card : AtmoCollectors; let player : Player;

  beforeEach(function() {
    card = new AtmoCollectors();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.titanium).to.eq(2);
  });
});
