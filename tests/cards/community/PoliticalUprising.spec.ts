import {expect} from 'chai';
import {PoliticalUprising} from '../../../src/cards/community/PoliticalUprising';
import {Game} from '../../../src/Game';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('PoliticalUprising', function() {
  let card : PoliticalUprising; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PoliticalUprising();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(4);

    while (game.deferredActions.length) {
      const selectParty = game.deferredActions.peek()!.execute() as SelectPartyToSendDelegate;
      selectParty.cb(PartyName.MARS);
      game.deferredActions.pop();
    }

    const turmoil = game.turmoil!;
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(4);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
