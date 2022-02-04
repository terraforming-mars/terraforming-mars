import {expect} from 'chai';
import {SeptumTribus} from '../../../src/cards/turmoil/SeptumTribus';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('SeptumTribus', function() {
  it('Should play', function() {
    const card = new SeptumTribus();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    card.play();

    player.corporationCard = card;
    player.megaCredits = 0;

    const turmoil = game.turmoil;
    expect(game.turmoil).is.not.undefined;

    if (turmoil) {
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
      card.action(player);
      expect(player.megaCredits).to.eq(2);

      player.megaCredits = 0;
      turmoil.sendDelegateToParty(player.id, PartyName.KELVINISTS, game);
      turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
      card.action(player);
      expect(player.megaCredits).to.eq(6);
    }
  });
});
