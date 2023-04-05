import {expect} from 'chai';
import {SupportedResearch} from '../../../src/server/cards/turmoil/SupportedResearch';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SupportedResearch', function() {
  it('Should play', function() {
    const card = new SupportedResearch();
    const [game, player] = testGame(2, testGameOptions({turmoilExtension: true}));
    expect(player.simpleCanPlay(card)).is.not.true;

    const scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS);
    scientists.delegates.add(player.id, 2);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
