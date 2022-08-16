import {expect} from 'chai';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('EventAnalysts', function() {
  it('Should play', function() {
    const card = new EventAnalysts();
    const player = TestPlayer.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        expect(player.canPlayIgnoringCost(card)).is.true;

        card.play(player);
        expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });
});
