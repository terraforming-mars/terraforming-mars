import {expect} from 'chai';
import {Recruitment} from '../../../src/cards/turmoil/Recruitment';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestPlayers} from '../../TestPlayers';

describe('Recruitment', function() {
  it('Should play', function() {
    const card = new Recruitment();
    const player = TestPlayers.BLUE.newPlayer();

    const game = Game.newInstance('foobar', [player], player);

        game.turmoil!.parties.forEach((party) => {
          party.delegates = [];
        });
        expect(card.canPlay(player)).is.not.true;

        game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        expect(card.canPlay(player)).is.not.true;
        game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        expect(card.canPlay(player)).is.true;

        card.play(player);
  });
});
