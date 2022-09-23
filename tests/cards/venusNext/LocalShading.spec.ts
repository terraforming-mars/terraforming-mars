import {expect} from 'chai';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LocalShading', function() {
  let card: LocalShading;
  let player: Player;

  beforeEach(function() {
    card = new LocalShading();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });
});
