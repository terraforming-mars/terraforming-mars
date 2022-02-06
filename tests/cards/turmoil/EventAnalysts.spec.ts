import {expect} from 'chai';
import {EventAnalysts} from '../../../src/cards/turmoil/EventAnalysts';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('EventAnalysts', function() {
  it('Should play', function() {
    const card = new EventAnalysts();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        game.turmoil!.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
        expect(player.canPlayIgnoringCost(card)).is.true;

        card.play(player);
        expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });
});
