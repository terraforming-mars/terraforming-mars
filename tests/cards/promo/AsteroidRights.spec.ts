import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {AsteroidRights} from '../../../src/server/cards/promo/AsteroidRights';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, testGame} from '../../TestingUtils';

describe('AsteroidRights', function() {
  let card: AsteroidRights;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AsteroidRights();
    [/* game */, player/* , player2 */] = testGame(2);

    player.playedCards.push(card);
    card.play(player);
    runAllActions(player.game);
  });

  it('Should play', function() {
    expect(card.resourceCount).to.eq(2);
  });

  it('Can not act', function() {
    player.megaCredits = 0;
    card.resourceCount = 0;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act - can auto spend asteroid resource', function() {
    player.megaCredits = 0;
    const action = cast(card.action(player), OrOptions);

    // Gain 1 M€ prod
    action.options[1].cb();
    expect(player.production.megacredits).to.eq(1);

    // Gain 2 titanium
    action.options[0].cb();
    expect(player.titanium).to.eq(2);
  });

  it('Should play - can auto add asteroid resource to self', function() {
    player.megaCredits = 1;
    card.resourceCount = 0;

    card.action(player);
    player.game.deferredActions.peek()!.execute();
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play - can add asteroid resource to other card', function() {
    player.megaCredits = 1;
    card.resourceCount = 0;
    const cometAiming = new CometAiming();
    player.playedCards.push(cometAiming);

    const action = cast(card.action(player), SelectCard<ICard>);
    action.cb([cometAiming]);
    expect(cometAiming.resourceCount).to.eq(1);
  });

  it('Should play - all options available', function() {
    player.megaCredits = 1;
    const cometAiming = new CometAiming();
    player.playedCards.push(cometAiming);

    const action = cast(card.action(player), OrOptions);
    expect(action.options[0] instanceof SelectOption).is.true;
    expect(action.options[1] instanceof SelectOption).is.true;
    expect(action.options[2] instanceof SelectCard).is.true;
  });
});
