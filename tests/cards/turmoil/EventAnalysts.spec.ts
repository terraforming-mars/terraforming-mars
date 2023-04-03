import {expect} from 'chai';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EventAnalysts', function() {
  it('Should play', function() {
    const card = new EventAnalysts();
    const [game, player] = testGame(1, testGameOptions({turmoilExtension: true}));
    expect(player.simpleCanPlay(card)).is.not.true;

    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });
});
