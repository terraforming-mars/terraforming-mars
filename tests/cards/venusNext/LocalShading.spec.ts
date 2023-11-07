import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';
import {cast, churnAction} from '../../TestingUtils';

describe('LocalShading', function() {
  let card: LocalShading;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LocalShading();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    expect(churnAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast( churnAction(card, player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });
});
