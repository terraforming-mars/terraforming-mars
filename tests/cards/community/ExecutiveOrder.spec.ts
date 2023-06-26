import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {ExecutiveOrder} from '../../../src/server/cards/community/ExecutiveOrder';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('ExecutiveOrder', function() {
  let card: ExecutiveOrder;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ExecutiveOrder();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, redPlayer], player, {turmoilExtension: true});
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(10);
    expect(game.deferredActions).has.lengthOf(2);

    const turmoil = game.turmoil!;
    const selectGlobalEvent = cast(game.deferredActions.pop()!.execute(), OrOptions);
    selectGlobalEvent.options[0].cb();
    expect(turmoil.currentGlobalEvent).is.not.undefined;

    const selectParty = cast(game.deferredActions.pop()!.execute(), SelectParty);
    selectParty.cb(PartyName.MARS);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player.id)).eq(2);
  });
});
