import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';
import {PROffice} from '../../../src/server/cards/turmoil/PROffice';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('PROffice', function() {
  it('Should play', function() {
    const card = new PROffice();
    const card2 = new Sponsors();
    const card3 = new AcquiredCompany();
    const player = TestPlayer.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const unity = game.turmoil!.getPartyByName(PartyName.UNITY)!;
    unity.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
