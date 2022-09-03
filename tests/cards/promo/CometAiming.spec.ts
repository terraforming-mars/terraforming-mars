import {expect} from 'chai';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans} from '../../TestingUtils';

describe('CometAiming', function() {
  let card: CometAiming;
  let player: Player;

  beforeEach(function() {
    card = new CometAiming();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
  });

  it('Can not act', function() {
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
    const selectSpace = cast(player.game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Should act - multiple action choices, multiple targets', function() {
    const card2 = new RotatorImpacts();
    player.playedCards.push(card, card2);

    player.titanium = 1;
    card.resourceCount = 1;

    const action = cast(card.action(player), OrOptions);
    action.options[1].cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(0);
  });

  it('Cannot spend resource to place ocean if oceans are maxed', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    maxOutOceans(player);
    expect(card.canAct(player)).is.not.true;

    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(2);
  });
});
