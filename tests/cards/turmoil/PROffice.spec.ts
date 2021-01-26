import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/cards/base/AcquiredCompany';
import {Sponsors} from '../../../src/cards/base/Sponsors';
import {PROffice} from '../../../src/cards/turmoil/PROffice';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('PROffice', function() {
  it('Should play', function() {
    const card = new PROffice();
    const card2 = new Sponsors();
    const card3 = new AcquiredCompany();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(card.canPlay(player)).is.not.true;

    const unity = game.turmoil!.getPartyByName(PartyName.UNITY)!;
    unity.delegates.push(player.id, player.id);
    expect(card.canPlay(player)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
