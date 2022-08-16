import {expect} from 'chai';
import {PoliticalUprising} from '../../../src/server/cards/community/PoliticalUprising';
import {Game} from '../../../src/server/Game';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {Player} from '../../../src/server/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('PoliticalUprising', function() {
  let card: PoliticalUprising;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new PoliticalUprising();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
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
