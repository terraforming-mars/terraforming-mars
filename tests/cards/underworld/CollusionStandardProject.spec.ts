import {expect} from 'chai';

import {CollusionStandardProject} from '../../../src/server/cards/underworld/CollusionStandardProject';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {MultiSet} from 'mnemonist';

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
    expect(card.play(player)).is.undefined;
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

    card.action(player);
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

    card.action(player);
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

  // The collusion standard project has bit of an issue. You can not send delegate to party with only 1 neutral on it .  Error message pops up and then the neutral delegate gets removed ... but they still have neutral party leader with none in party.

  // TODO(kberg): Add more tests.
  // e.g., tests for entering the wrong number of delegates (only 1 neutral available, or only 1 in your supply.)
});
