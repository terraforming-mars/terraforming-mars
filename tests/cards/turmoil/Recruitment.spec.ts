import {expect} from 'chai';
import {Recruitment} from '../../../src/cards/turmoil/Recruitment';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Recruitment', function() {
  it('Should play', function() {
    const card = new Recruitment();
    const player = TestPlayer.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);

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
