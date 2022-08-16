import {expect} from 'chai';
import {SupportedResearch} from '../../../src/server/cards/turmoil/SupportedResearch';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SupportedResearch', function() {
  it('Should play', function() {
    const card = new SupportedResearch();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS)!;
    scientists.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
