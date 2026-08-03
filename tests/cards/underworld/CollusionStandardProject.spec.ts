import {expect} from 'chai';

import {CollusionStandardProject} from '../../../src/server/cards/underworld/CollusionStandardProject';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {Payment} from '../../../src/common/inputs/Payment';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {MultiSet} from 'mnemonist';
import {cast} from '../../../src/common/utils/utils';

describe('CollusionStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: CollusionStandardProject;
  let turmoil: Turmoil;

  beforeEach(() => {
    [game, player] = testGame(1, {turmoilExtension: true});
    card = new CollusionStandardProject();
    turmoil = Turmoil.getTurmoil(game);
    turmoil.parties.forEach((party) => {
      party.delegates.clear();
    });
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    cast(card.play(player), undefined);
  });

  it('can act', () => {
    expect(card.canAct(player)).is.false;
  });

  it('can act - no delegates', () => {
    player.underworldData.corruption = 1;
    expect(card.canAct(player)).is.false;
  });

  it('can act - no corruption', () => {
    player.underworldData.corruption = 0;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    expect(card.canAct(player)).is.false;
  });

  // Regression for #8238: the server must reject a Collusion submission when canAct is false,
  // even though the project costs 0 M€ and the client would have greyed out the button.
  it('cannot be played when canAct is false', () => {
    player.underworldData.corruption = 0;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    const select = new SelectStandardProjectToPlay(player, [card], {enabled: [card.canAct(player)]});
    expect(() => select.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: 0})}))
      .to.throw(/cannot play this standard project/);
    expect(player.underworldData.corruption).eq(0);
  });

  it('can act', () => {
    player.underworldData.corruption = 1;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.underworldData.corruption = 1;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    turmoil.sendDelegateToParty('NEUTRAL', PartyName.UNITY, game);

    card.payAndExecute(player, Payment.of({megacredits: 0}));
    runAllActions(game);

    const andOptions = cast(player.popWaitingFor(), AndOptions);
    const selectAmount = cast(andOptions.options[0], SelectAmount);
    const selectParty = cast(andOptions.options[1], SelectParty);

    selectAmount.cb(1);
    selectParty.cb(PartyName.GREENS);
    andOptions.cb(undefined);

    expect(player.underworldData.corruption).eq(0);
    expect(turmoil.getPartyByName(PartyName.GREENS).delegates).deep.eq(MultiSet.from(['NEUTRAL', 'NEUTRAL', player]));
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('action - one delegate', () => {
    player.underworldData.corruption = 1;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.UNITY, game);

    card.payAndExecute(player, Payment.of({megacredits: 0}));
    runAllActions(game);

    const andOptions = cast(player.popWaitingFor(), AndOptions);
    const selectAmount = cast(andOptions.options[0], SelectAmount);
    const selectParty = cast(andOptions.options[1], SelectParty);

    selectAmount.cb(1);
    selectParty.cb(PartyName.UNITY);
    andOptions.cb(undefined);

    expect(player.underworldData.corruption).eq(0);
    const unity = turmoil.getPartyByName(PartyName.UNITY);
    expect(unity.delegates).deep.eq(MultiSet.from([player]));
    expect(unity.partyLeader).eq(player);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('action - error: only 1 neutral in party but 2 requested', () => {
    player.underworldData.corruption = 1;
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    card.payAndExecute(player, Payment.of({megacredits: 0}));
    runAllActions(game);

    const andOptions = cast(player.popWaitingFor(), AndOptions);
    const selectAmount = cast(andOptions.options[0], SelectAmount);
    const selectParty = cast(andOptions.options[1], SelectParty);

    selectAmount.cb(2);
    selectParty.cb(PartyName.GREENS);
    expect(() => andOptions.cb(undefined)).to.throw(/Greens does not have 2 neutral delegates/);
  });

  it('action - error: player has 1 delegate in reserve but 2 requested', () => {
    player.underworldData.corruption = 1;
    // Send enough delegates to leave only 1 in reserve.
    while (turmoil.getAvailableDelegateCount(player) > 1) {
      turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    }
    // Add 2 neutrals so both parties and count are satisfied.
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    card.payAndExecute(player, Payment.of({megacredits: 0}));
    runAllActions(game);

    const andOptions = cast(player.popWaitingFor(), AndOptions);
    const selectAmount = cast(andOptions.options[0], SelectAmount);
    const selectParty = cast(andOptions.options[1], SelectParty);

    selectAmount.cb(2);
    selectParty.cb(PartyName.GREENS);
    expect(() => andOptions.cb(undefined)).to.throw(/Player does not have 2 delegates in reserve/);
  });
});
