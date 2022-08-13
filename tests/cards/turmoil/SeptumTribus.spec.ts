import {expect} from 'chai';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SeptumTribus', function() {
  it('Should play', function() {
    const card = new SeptumTribus();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player, player2], player, gameOptions);
    card.play();

    player.setCorporationForTest(card);
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
