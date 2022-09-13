import {expect} from 'chai';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SeptumTribus', function() {
  it('Should play', function() {
    const card = new SeptumTribus();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);
    card.play(player);

    player.setCorporationForTest(card);
    player.megaCredits = 0;

    const turmoil = game.turmoil!;

    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    card.action(player);
    expect(player.megaCredits).to.eq(2);

    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player.id, PartyName.KELVINISTS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    card.action(player);
    expect(player.megaCredits).to.eq(6);
  });
});
