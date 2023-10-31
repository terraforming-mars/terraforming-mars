import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {ExecutiveOrder} from '../../../src/server/cards/community/ExecutiveOrder';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {SelectGlobalEvent} from '../../../src/server/inputs/SelectGlobalEvent';
import {testGame} from '../../TestGame';

describe('ExecutiveOrder', function() {
  let card: ExecutiveOrder;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ExecutiveOrder();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const selectGlobalEvent = cast(card.play(player), SelectGlobalEvent);
    expect(selectGlobalEvent.globalEvents).has.length(4);

    expect(player.megaCredits).to.eq(10);
    selectGlobalEvent.cb(selectGlobalEvent.globalEvents[0]);

    expect(turmoil.currentGlobalEvent).eq(selectGlobalEvent.globalEvents[0]);
    runAllActions(game);

    const selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(PartyName.MARS);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(2);
  });
});
