import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {PROffice} from '../../../src/server/cards/turmoil/PROffice';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PROffice', function() {
  it('Should play', function() {
    const card = new PROffice();
    const card2 = new Sponsors();
    const card3 = new AcquiredCompany();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);

    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const unity = game.turmoil!.getPartyByName(PartyName.UNITY);
    unity.delegates.add(player.id, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.megaCredits).to.eq(3);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
