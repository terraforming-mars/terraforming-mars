import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ForcedPrecipitation} from '../../../src/server/cards/venusNext/ForcedPrecipitation';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ForcedPrecipitation', function() {
  let card: ForcedPrecipitation;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ForcedPrecipitation();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act - both actions available', function() {
    player.playedCards.push(card);
    player.megaCredits = 10;

    const action = card.action(player);
    game.deferredActions.runNext();
    cast(action, undefined);
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);

    player.addResourceTo(card);
    expect(card.resourceCount).to.eq(2);

    const orOptions2 = cast(card.action(player), OrOptions);
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
