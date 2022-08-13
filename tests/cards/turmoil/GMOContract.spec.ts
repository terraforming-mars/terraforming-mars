import {expect} from 'chai';
import {GMOContract} from '../../../src/server/cards/turmoil/GMOContract';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('GMOContract', function() {
  it('Should play', function() {
    const card = new GMOContract();
    const player = TestPlayer.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);

    if (game.turmoil !== undefined) {
      game.turmoil.rulingParty = game.turmoil.getPartyByName(PartyName.REDS);
      expect(player.canPlayIgnoringCost(card)).is.not.true;
      const greens = game.turmoil.getPartyByName(PartyName.GREENS);
      if (greens !== undefined) {
        greens.delegates.push(player.id, player.id);
        expect(player.canPlayIgnoringCost(card)).is.true;
      }
      card.play();
      card.onCardPlayed(player, card);
      game.deferredActions.runNext();
      expect(player.megaCredits).to.eq(2);
    }
  });
});
