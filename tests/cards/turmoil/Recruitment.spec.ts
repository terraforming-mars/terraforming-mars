import {expect} from 'chai';
import {Recruitment} from '../../../src/cards/turmoil/Recruitment';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('Recruitment', function() {
  it('Should play', function() {
    const card = new Recruitment();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);

        game.turmoil!.parties.forEach((party) => {
          party.delegates = [];
        });
        expect(card.canPlay(player, game)).is.not.true;

        game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        expect(card.canPlay(player, game)).is.not.true;
        game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        expect(card.canPlay(player, game)).is.true;

        card.play(player, game);
  });
});
