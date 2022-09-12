import {expect} from 'chai';
import {Recruitment} from '../../../src/server/cards/turmoil/Recruitment';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Recruitment', function() {
  it('Should play', function() {
    const card = new Recruitment();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);

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
