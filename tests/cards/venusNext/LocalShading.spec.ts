import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LocalShading', function() {
  let card: LocalShading;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LocalShading();
    [/* skipped */, player] = testGame(1);
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
