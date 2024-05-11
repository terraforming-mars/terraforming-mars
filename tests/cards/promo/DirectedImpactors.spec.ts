import {expect} from 'chai';
import {DirectedImpactors} from '../../../src/server/cards/promo/DirectedImpactors';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {MAX_TEMPERATURE} from '../../../src/common/constants';
import {IGame} from '../../../src/server/IGame';
import {Payment} from '../../../src/common/inputs/Payment';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {TestPlayer} from '../../TestPlayer';
import {cast, setTemperature} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';

describe('DirectedImpactors', function() {
  let card: DirectedImpactors;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new DirectedImpactors();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
  });

  it('Should act - single action choice, single target', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player.megaCredits = 3;
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    // can add resource to itself
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectPayment = cast(game.deferredActions.peek()!.execute(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, titanium: 1, megaCredits: 3});

    expect(player.megaCredits).to.eq(0);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);

    // can remove resource to raise temperature
    card.action(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.game.getTemperature()).to.eq(-28);
    expect(card.resourceCount).to.eq(0);
  });

  it('Should act - multiple action choices, multiple targets', function() {
    const card2 = new RotatorImpacts();
    player.playedCards.push(card, card2);

    player.megaCredits = 3;
    player.titanium = 1;
    card.resourceCount = 1;

    const action = cast(card.action(player), OrOptions);

    // can remove resource to raise temperature
    action.options[0].cb();
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.game.getTemperature()).to.eq(-28);
    expect(card.resourceCount).to.eq(0);

    // can add resource to any card
    const selectCard = cast(action.options[1].cb(), SelectCard);
    expect(game.deferredActions).has.lengthOf(1);
    const selectPayment = cast(game.deferredActions.peek()!.execute(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, titanium: 1, megaCredits: 3});

    selectCard!.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(0);
    expect(player.titanium).to.eq(0);
  });

  it('Can still spend resource even if temperature is max', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    setTemperature(game, MAX_TEMPERATURE);

    expect(card.canAct(player)).is.true;
  });
});
