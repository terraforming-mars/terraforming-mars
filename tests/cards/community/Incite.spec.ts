import {expect} from 'chai';
import {Incite} from '../../../src/server/cards/community/Incite';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {Game} from '../../../src/server/Game';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast, getSendADelegateOption, runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';

describe('Incite', function() {
  let card: Incite;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new Incite();
    player = TestPlayer.BLUE.newPlayer();

    game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));

    card.play(player);
    player.setCorporationForTest(card);
    turmoil = game.turmoil!;
  });

  it('Starts with +1 influence', function() {
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(1);
  });

  it('Works with Event Analysts', function() {
    const eventAnalysts = new EventAnalysts();
    eventAnalysts.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(2);
  });

  it('Can perform initial action', function() {
    card.initialAction(player);
    expect(game.deferredActions).has.lengthOf(1);

    const sendDelegate = cast(game.deferredActions.peek()!.execute(), SelectPartyToSendDelegate);
    sendDelegate.cb(PartyName.MARS);

    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player.id)).eq(2);
  });

  it('Lobbying costs 3MC', () => {
    turmoil.usedFreeDelegateAction.add(player.id);

    player.megaCredits = 2;
    expect(getSendADelegateOption(player)).is.undefined;

    player.megaCredits = 3;
    const selectParty = cast(getSendADelegateOption(player), SelectPartyToSendDelegate);

    expect(selectParty.title).eq('Send a delegate in an area (3 M€)');
    expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player.id)).eq(0);

    selectParty.cb(PartyName.KELVINISTS);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player.id)).eq(1);
  });
});
