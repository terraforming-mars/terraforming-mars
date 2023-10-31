import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {PROffice} from '../../../src/server/cards/turmoil/PROffice';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('PROffice', function() {
  it('Should play', function() {
    const card = new PROffice();
    const card2 = new Sponsors();
    const card3 = new AcquiredCompany();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(player.simpleCanPlay(card)).is.not.true;

    const unity = game.turmoil!.getPartyByName(PartyName.UNITY);
    unity.delegates.add(player, 2);
    expect(player.simpleCanPlay(card)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.megaCredits).to.eq(3);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
