import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {AsteroidRights} from '../../../src/cards/promo/AsteroidRights';
import {CometAiming} from '../../../src/cards/promo/CometAiming';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectOption} from '../../../src/inputs/SelectOption';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('AsteroidRights', function() {
  let card : AsteroidRights; let player : Player;

  beforeEach(function() {
    card = new AsteroidRights();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);

    player.playedCards.push(card);
    card.play();
  });

  it('Should play', function() {
    expect(card.resourceCount).to.eq(2);
  });

  it('Can\'t act', function() {
    player.megaCredits = 0;
    card.resourceCount = 0;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act - can auto spend asteroid resource', function() {
    player.megaCredits = 0;
    const action = card.action(player) as OrOptions;

    // Gain 1 MC prod
    action.options[1].cb();
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);

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

    const action = card.action(player) as SelectCard<ICard>;
    action.cb([cometAiming]);
    expect(cometAiming.resourceCount).to.eq(1);
  });

  it('Should play - all options available', function() {
    player.megaCredits = 1;
    const cometAiming = new CometAiming();
    player.playedCards.push(cometAiming);

    const action = card.action(player) as OrOptions;
    expect(action instanceof OrOptions).is.true;
    expect(action.options[0] instanceof SelectOption).is.true;
    expect(action.options[1] instanceof SelectCard).is.true;
  });
});
