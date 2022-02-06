import {expect} from 'chai';
import {GMOContract} from '../../../src/cards/turmoil/GMOContract';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('GMOContract', function() {
  it('Should play', function() {
    const card = new GMOContract();
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);

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
