import {expect} from 'chai';
import {Incite} from '../../../src/server/cards/community/Incite';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {IGame} from '../../../src/server/IGame';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast, getSendADelegateOption, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';

describe('Incite', () => {
  let card: Incite;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new Incite();

    [game, player] = testGame(1, {turmoilExtension: true});

    card.play(player);
    player.corporations.push(card);
    turmoil = game.turmoil!;
  });

  it('Starts with +1 influence', () => {
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(1);
  });

  it('Works with Event Analysts', () => {
    const eventAnalysts = new EventAnalysts();
    eventAnalysts.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(2);
  });

  it('Can perform initial action', () => {
    player.deferInitialAction(card);
    runAllActions(game);

    const sendDelegate = cast(player.getWaitingFor(), SelectParty);
    sendDelegate.cb(PartyName.MARS);

    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(2);
  });

  it('Lobbying costs 3MC', () => {
    turmoil.usedFreeDelegateAction.add(player);

    player.megaCredits = 2;
    expect(getSendADelegateOption(player)).is.undefined;

    player.megaCredits = 3;
    const selectParty = cast(getSendADelegateOption(player), SelectParty);

    expect(selectParty.title).eq('Send a delegate in an area (3 M€)');
    expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player)).eq(0);

    selectParty.cb(PartyName.KELVINISTS);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player)).eq(1);
  });
});
