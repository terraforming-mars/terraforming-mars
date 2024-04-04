import {expect} from 'chai';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('EventAnalysts', function() {
  it('Should play', function() {
    const card = new EventAnalysts();
    const [game, player] = testGame(1, {turmoilExtension: true});
    expect(card.canPlay(player)).is.not.true;

    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });
});
