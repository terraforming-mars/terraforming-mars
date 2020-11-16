import {expect} from 'chai';
import {PROffice} from '../../../src/cards/turmoil/PROffice';
import {Player} from '../../../src/Player';
import {Color} from '../../../src/Color';
import {Resources} from '../../../src/Resources';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Sponsors} from '../../../src/cards/Sponsors';
import {AcquiredCompany} from '../../../src/cards/AcquiredCompany';
import {setCustomGameOptions} from '../../TestingUtils';

describe('PROffice', function() {
  it('Should play', function() {
    const card = new PROffice();
    const card2 = new Sponsors();
    const card3 = new AcquiredCompany();
    const player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    const unity = game.turmoil!.getPartyByName(PartyName.UNITY)!;
    unity.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player, game);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
