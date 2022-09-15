import {expect} from 'chai';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('EventAnalysts', function() {
  it('Should play', function() {
    const card = new EventAnalysts();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });
});
