import {expect} from 'chai';
import {UnitedNationsMarsInitiative} from '../../../src/server/cards/corporation/UnitedNationsMarsInitiative';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {cast, churnAction, runAllActions} from '../../TestingUtils';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';
import {testGame} from '../../TestGame';

describe('UnitedNationsMarsInitiative', function() {
  let card: UnitedNationsMarsInitiative;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new UnitedNationsMarsInitiative();
    [game, player] = testGame(2);
    player.corporations.push(card);
  });

  it('Can not act if TR was not raised', function() {
    player.megaCredits = 10;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can not act if not enough MC', function() {
    player.setTerraformRating(21);
    player.megaCredits = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.increaseTerraformRating();
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    runAllActions(game);
    expect(player.megaCredits).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });

  it('Helion + UNMI', () => {
    const helion = new Helion();
    helion.play(player);
    player.corporations.push(helion);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).to.eq(21);
    player.megaCredits = 2;
    expect(card.canAct(player)).is.false;
    player.heat = 1;
    expect(card.canAct(player)).is.true;

    // Setting a larger amount of heat just to make the test results more interesting
    player.heat = 5;

    const selectPayment = cast(churnAction(card, player), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, megaCredits: 1, heat: 2});
    expect(player.getTerraformRating()).to.eq(22);
    expect(player.megaCredits).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
