import {expect} from 'chai';
import {PoliticalUprising} from '../../../src/server/cards/community/PoliticalUprising';
import {Game} from '../../../src/server/Game';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('PoliticalUprising', function() {
  let card: PoliticalUprising;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PoliticalUprising();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, {turmoilExtension: true});
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(4);

    while (game.deferredActions.length) {
      const selectParty = cast(game.deferredActions.peek()!.execute(), SelectParty);
      selectParty.cb(PartyName.MARS);
      game.deferredActions.pop();
    }

    const turmoil = game.turmoil!;
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(4);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
