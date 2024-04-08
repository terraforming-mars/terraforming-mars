import {Game} from '../../../src/server/Game';
import {TempestConsultancy} from '../../../src/server/cards/moon/TempestConsultancy';
import {expect} from 'chai';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {cast, runAllActions} from '../../TestingUtils';
import {VoteOfNoConfidence} from '../../../src/server/cards/turmoil/VoteOfNoConfidence';

describe('TempestConsultancy', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: Game;
  let card: TempestConsultancy;
  let turmoil: Turmoil;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, otherPlayer], player, {turmoilExtension: true});
    card = new TempestConsultancy();
    turmoil = game.turmoil!;
  });

  it('can act', () => {
    player.tagsForTest = {moon: 5};
    expect(card.canAct(player)).is.true;

    player.tagsForTest = {moon: 4};
    expect(card.canAct(player)).is.false;
  });

  it('cannot act, not enough delegates', () => {
    player.tagsForTest = {moon: 5};
    expect(card.canAct(player)).is.true;
    turmoil.delegateReserve.clear();
    expect(card.canAct(player)).is.false;
  });

  it('action, 1 delegate', () => {
    player.tagsForTest = {moon: 5};
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(0);
    card.action(player);
    const action = cast(player.game.deferredActions.pop(), SendDelegateToArea);
    const options = action.execute();
    options!.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(6);
    expect(marsFirst.delegates.get(player)).eq(1);
  });

  it('action, 3 delegates', () => {
    player.tagsForTest = {moon: 16};
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(0);
    card.action(player);
    const action = cast(player.game.deferredActions.pop(), SendDelegateToArea);
    const options = cast(action.execute(), SelectParty);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(4);
    expect(marsFirst.delegates.get(player)).eq(3);
  });

  it('action, 3 delegates, only 2 available', () => {
    player.tagsForTest = {moon: 16};
    turmoil.delegateReserve.clear();
    turmoil.delegateReserve.add(player, 2);
    expect(turmoil.getAvailableDelegateCount(player)).eq(2);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(0);

    card.action(player);

    const action = cast(player.game.deferredActions.pop(), SendDelegateToArea);
    const options = cast(action.execute(), SelectParty);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(0);
    expect(marsFirst.delegates.get(player)).eq(2);
  });

  it('new chairman', () => {
    player.setCorporationForTest(card);
    turmoil.dominantParty = new Greens();
    turmoil.dominantParty.partyLeader = player;
    expect(player.getTerraformRating()).eq(20);

    turmoil.setRulingParty(game);
    runAllActions(game);

    expect(turmoil.chairman).eq(player);
    expect(player.getTerraformRating()).eq(22);
  });

  it('With Vote of No Confidence', () => {
    player.setCorporationForTest(card);
    turmoil.chairman = 'NEUTRAL';

    const greens = turmoil.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;

    expect(player.getTerraformRating()).to.eq(20);

    const voteOfNoConfidence = new VoteOfNoConfidence();
    voteOfNoConfidence.play(player);

    expect(turmoil.chairman).eq(player);
    runAllActions(game);
    // With Vote of No Confidence, player becomes chairman and gains 1 TR. Tempest gives player a second TR.
    expect(player.getTerraformRating()).to.eq(22);
  });
});

