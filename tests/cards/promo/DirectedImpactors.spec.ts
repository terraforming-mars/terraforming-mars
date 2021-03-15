import {expect} from 'chai';
import {DirectedImpactors} from '../../../src/cards/promo/DirectedImpactors';
import {RotatorImpacts} from '../../../src/cards/venusNext/RotatorImpacts';
import {MAX_TEMPERATURE} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {HowToPay} from '../../../src/inputs/HowToPay';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectHowToPay} from '../../../src/inputs/SelectHowToPay';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('DirectedImpactors', function() {
  let card : DirectedImpactors; let player : Player; let game : Game;

  beforeEach(function() {
    card = new DirectedImpactors();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play()).is.undefined;
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
    const selectHowToPay = game.deferredActions.peek()!.execute() as SelectHowToPay;
    selectHowToPay.cb({steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0} as HowToPay);

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

    const action = card.action(player) as OrOptions;

    // can remove resource to raise temperature
    action.options[0].cb();
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.game.getTemperature()).to.eq(-28);
    expect(card.resourceCount).to.eq(0);

    // can add resource to any card
    const selectCard = action.options[1].cb();
    expect(game.deferredActions).has.lengthOf(1);
    const selectHowToPay = game.deferredActions.peek()!.execute() as SelectHowToPay;
    selectHowToPay.cb({steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0} as HowToPay);

        selectCard!.cb([card2]);
        expect(card2.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(0);
        expect(player.titanium).to.eq(0);
  });

  it('Can still spend resource even if temperature is max', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    (game as any).temperature = MAX_TEMPERATURE;

    expect(card.canAct(player)).is.true;
  });
});
