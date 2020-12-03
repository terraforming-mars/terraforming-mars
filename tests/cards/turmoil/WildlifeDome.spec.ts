import {expect} from 'chai';
import {WildlifeDome} from '../../../src/cards/turmoil/WildlifeDome';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('WildlifeDome', function() {
  it('Should play', function() {
    const card = new WildlifeDome();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player, player], player, gameOptions);

        game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
        expect(card.canPlay(player, game)).is.not.true;

        const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
        greens.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).is.not.true;

        player.megaCredits = 18;
        expect(card.canPlay(player, game)).is.true;

        const action = card.play(player, game);
        expect(action).is.not.undefined;
        action.cb(action.availableSpaces[0]);
        expect(game.getOxygenLevel()).to.eq(1);
  });
});
