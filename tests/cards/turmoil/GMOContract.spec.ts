import {expect} from 'chai';
import {GMOContract} from '../../../src/cards/turmoil/GMOContract';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('GMOContract', function() {
  it('Should play', function() {
    const card = new GMOContract();
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);

    if (game.turmoil !== undefined) {
      game.turmoil.rulingParty = game.turmoil.getPartyByName(PartyName.REDS);
      expect(card.canPlay(player)).is.not.true;
      const greens = game.turmoil.getPartyByName(PartyName.GREENS);
      if (greens !== undefined) {
        greens.delegates.push(player.id, player.id);
        expect(card.canPlay(player)).is.true;
      }
      card.play();
      card.onCardPlayed(player, card);
      game.deferredActions.runNext();
      expect(player.megaCredits).to.eq(2);
    }
  });
});
