import {expect} from 'chai';
import {Recruitment} from '../../../src/server/cards/turmoil/Recruitment';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('Recruitment', () => {
  it('Should play', () => {
    const card = new Recruitment();
    const [game, player] = testGame(1, {turmoilExtension: true});

    game.turmoil!.parties.forEach((party) => {
      party.delegates.clear();
    });
    expect(card.canPlay(player)).is.not.true;

    game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    expect(card.canPlay(player)).is.not.true;
    game.turmoil!.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    expect(card.canPlay(player)).is.true;

    card.play(player);
  });
});
