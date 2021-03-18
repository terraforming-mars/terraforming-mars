import {expect} from 'chai';
import {CometAiming} from '../../../src/cards/promo/CometAiming';
import {RotatorImpacts} from '../../../src/cards/venusNext/RotatorImpacts';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from './../../TestingUtils';

describe('CometAiming', function() {
  let card : CometAiming; let player : Player;

  beforeEach(function() {
    card = new CometAiming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play()).is.undefined;
  });

  it('Can\'t act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act - single action choice, single target', function() {
    player.playedCards.push(card);
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(player.game.deferredActions).has.lengthOf(1);
    const selectSpace = player.game.deferredActions.peek()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Should act - multiple action choices, multiple targets', function() {
    const card2 = new RotatorImpacts();
    player.playedCards.push(card, card2);

    player.titanium = 1;
    card.resourceCount = 1;

    const action = card.action(player) as OrOptions;
    action.options[1].cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(0);
  });

  it('Cannot spend resource to place ocean if oceans are maxed', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    TestingUtils.maxOutOceans(player);
    expect(card.canAct(player)).is.not.true;

    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(2);
  });
});
