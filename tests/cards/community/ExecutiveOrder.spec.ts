import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Game, GameOptions} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {ExecutiveOrder} from '../../../src/cards/community/ExecutiveOrder';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('ExecutiveOrder', function() {
  let card : ExecutiveOrder; let player : Player; let game : Game;

  beforeEach(() => {
    card = new ExecutiveOrder();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions() as GameOptions;
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(10);
    expect(game.deferredActions).has.lengthOf(2);

    const turmoil = game.turmoil!;
    const selectGlobalEvent = game.deferredActions.pop()!.execute() as OrOptions;
    selectGlobalEvent.options[0].cb();
    expect(turmoil.currentGlobalEvent).is.not.undefined;

    const selectParty = game.deferredActions.pop()!.execute() as SelectPartyToSendDelegate;
    selectParty.cb(PartyName.MARS);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });
});
