import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {ExecutiveOrder} from '../../../src/server/cards/community/ExecutiveOrder';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('ExecutiveOrder', function() {
  let card: ExecutiveOrder;
  let player: Player;
  let game: Game;

  beforeEach(() => {
    card = new ExecutiveOrder();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({turmoilExtension: true}));
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(10);
    expect(game.deferredActions).has.lengthOf(2);

    const turmoil = game.turmoil!;
    const selectGlobalEvent = cast(game.deferredActions.pop()!.execute(), OrOptions);
    selectGlobalEvent.options[0].cb();
    expect(turmoil.currentGlobalEvent).is.not.undefined;

    const selectParty = cast(game.deferredActions.pop()!.execute(), SelectPartyToSendDelegate);
    selectParty.cb(PartyName.MARS);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });
});
