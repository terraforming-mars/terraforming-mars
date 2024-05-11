import {expect} from 'chai';
import {PoliticalUprising} from '../../../src/server/cards/community/PoliticalUprising';
import {IGame} from '../../../src/server/IGame';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('PoliticalUprising', function() {
  let card: PoliticalUprising;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new PoliticalUprising();
    [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
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
