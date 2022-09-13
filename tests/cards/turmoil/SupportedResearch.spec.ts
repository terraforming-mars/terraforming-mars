import {expect} from 'chai';
import {SupportedResearch} from '../../../src/server/cards/turmoil/SupportedResearch';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SupportedResearch', function() {
  it('Should play', function() {
    const card = new SupportedResearch();
    const game = newTestGame(2, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS)!;
    scientists.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
