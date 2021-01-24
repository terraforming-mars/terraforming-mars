import {expect} from 'chai';
import {GMOContract} from '../../../src/cards/turmoil/GMOContract';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import * as utils from '../../TestingUtils';

describe('GMOContract', function() {
  it('Should play', function() {
    const card = new GMOContract();
    const player = utils.TestPlayers.BLUE.newPlayer();
    const gameOptions = utils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);

    if (game.turmoil !== undefined) {
      game.turmoil.rulingParty = game.turmoil.getPartyByName(PartyName.REDS);
      expect(card.canPlay(player, game)).is.not.true;
      const greens = game.turmoil.getPartyByName(PartyName.GREENS);
      if (greens !== undefined) {
        greens.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).is.true;
      }
      card.play();
      card.onCardPlayed(player, card);
      utils.runNextAction(game);
      expect(player.megaCredits).to.eq(2);
    }
  });
});
