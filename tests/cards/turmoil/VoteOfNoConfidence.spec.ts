import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/cards/turmoil/VoteOfNoConfidence';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('VoteOfNoConfidence', function() {
  it('Should play', function() {
    const card = new VoteOfNoConfidence();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(card.canPlay(player)).is.not.true;

        game.turmoil!.chairman = 'NEUTRAL';
        expect(card.canPlay(player)).is.not.true;

        const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
        greens.partyLeader = player.id;
        expect(card.canPlay(player)).is.true;

        card.play(player);
        expect(game.getPlayerById(game.turmoil!.chairman)).to.eq(player);
        expect(player.getTerraformRating()).to.eq(15);
  });
});
