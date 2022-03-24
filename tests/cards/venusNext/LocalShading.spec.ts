import {expect} from 'chai';
import {LocalShading} from '../../../src/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('LocalShading', function() {
  let card: LocalShading;
  let player: Player;

  beforeEach(function() {
    card = new LocalShading();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
