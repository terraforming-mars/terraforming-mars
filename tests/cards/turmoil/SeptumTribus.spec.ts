import {expect} from 'chai';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('SeptumTribus', () => {
  it('Should play', () => {
    const card = new SeptumTribus();
    const [game, player] = testGame(1, {turmoilExtension: true});
    card.play(player);

    player.corporations.push(card);
    player.megaCredits = 0;

    const turmoil = game.turmoil!;

    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    card.action(player);
    expect(player.megaCredits).to.eq(2);

    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player, PartyName.KELVINISTS, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    card.action(player);
    expect(player.megaCredits).to.eq(6);
  });
});
