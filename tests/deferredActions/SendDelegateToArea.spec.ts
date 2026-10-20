import {expect} from 'chai';
import {SendDelegateToArea} from '../../src/server/deferredActions/SendDelegateToArea';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {cast} from '../../src/common/utils/utils';

describe('SendDelegateToArea', () => {
  let game: IGame;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  function setReserve(count: number) {
    while (turmoil.getAvailableDelegateCount(player) > count) {
      turmoil.delegateReserve.remove(player);
    }
  }

  function sentLogs() {
    return game.gameLog.filter((entry) => entry.message === '${0} sent ${1} delegate(s) in ${2} area');
  }

  it('sends a delegate, logs it and counts it', () => {
    setReserve(3);
    const input = cast(new SendDelegateToArea(player).execute(), SelectParty);
    input.cb(PartyName.GREENS);

    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get(player)).eq(1);
    expect(turmoil.getAvailableDelegateCount(player)).eq(2);
    expect(player.totalDelegatesPlaced).eq(1);
    expect(sentLogs()).has.length(1);
    expect(sentLogs()[0].data[1].value).eq('1');
  });

  it('sends several delegates to one party', () => {
    setReserve(5);
    const input = cast(new SendDelegateToArea(player, undefined, {count: 2}).execute(), SelectParty);
    input.cb(PartyName.GREENS);

    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get(player)).eq(2);
    expect(player.totalDelegatesPlaced).eq(2);
    expect(sentLogs()[0].data[1].value).eq('2');
  });

  it('with an empty reserve, asks nothing, logs nothing and counts nothing', () => {
    setReserve(0);

    expect(new SendDelegateToArea(player).execute()).is.undefined;

    expect(player.totalDelegatesPlaced).eq(0);
    expect(sentLogs()).is.empty;
  });

  it('with fewer delegates than requested, logs and counts only the delegates sent', () => {
    setReserve(1);
    const input = cast(new SendDelegateToArea(player, undefined, {count: 2}).execute(), SelectParty);
    input.cb(PartyName.GREENS);

    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get(player)).eq(1);
    expect(turmoil.getAvailableDelegateCount(player)).eq(0);
    expect(player.totalDelegatesPlaced).eq(1);
    expect(sentLogs()).has.length(1);
    expect(sentLogs()[0].data[1].value).eq('1');
  });

  it('replacing a delegate also needs a delegate in reserve', () => {
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    setReserve(0);

    expect(new SendDelegateToArea(player, undefined, {replace: 'NEUTRAL'}).execute()).is.undefined;

    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get('NEUTRAL')).eq(2);
    expect(player.totalDelegatesPlaced).eq(0);
  });

  it('does not use up the free lobby action when nothing is sent', () => {
    setReserve(0);

    new SendDelegateToArea(player, undefined, {freeStandardAction: true}).execute();

    expect(turmoil.usedFreeDelegateAction.has(player)).is.false;
  });
});
