import {expect} from 'chai';
import {SupportedResearch} from '../../../src/cards/turmoil/SupportedResearch';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('SupportedResearch', function() {
  it('Should play', function() {
    const card = new SupportedResearch();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player, redPlayer], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    const scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS)!;
    scientists.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
