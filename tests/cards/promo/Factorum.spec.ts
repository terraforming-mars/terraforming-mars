import {expect} from 'chai';
import {Factorum} from '../../../src/server/cards/promo/Factorum';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';
import {Tag} from '../../../src/common/cards/Tag';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {testGame} from '../../TestGame';

describe('Factorum', () => {
  let card: Factorum;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Factorum();
    [game, player] = testGame(2);
    player.corporations.push(card);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(player.production.steel).to.eq(1);
    player.megaCredits = 10;

    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
    const drawCardOption = cast(orOptions.options[1], SelectOption);

    drawCardOption.cb(undefined);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(7);

    const gainEnergyProductionOption = cast(orOptions.options[0], SelectOption);
    gainEnergyProductionOption.cb(undefined);
    expect(player.production.energy).to.eq(1);
  });

  it('Only offer building card if player has energy', () => {
    cast(card.play(player), undefined);
    player.megaCredits = 10;
    player.energy = 1;

    const selectOption = cast(card.action(player), SelectOption);
    selectOption.cb(undefined);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags).includes(Tag.BUILDING);
    expect(player.megaCredits).to.eq(7);
  });

  it('Factorum + Helion', () => {
    const helion = new Helion();
    helion.play(player);
    player.corporations.push(helion);

    player.megaCredits = 2;
    player.energy = 5;

    expect(card.canAct(player)).is.false;
    player.heat = 1;
    expect(card.canAct(player)).is.true;

    // Setting a larger amount of heat just to make the test results more interesting
    player.heat = 5;

    const selectOption = cast(card.action(player), SelectOption);
    selectOption.cb(undefined);
    runAllActions(game);

    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, megaCredits: 1, heat: 2});

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
