import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/cards/turmoil/SponsoredMohole';
import {Player} from '../../../src/Player';
import {Color} from '../../../src/Color';
import {Resources} from '../../../src/Resources';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';

describe('SponsoredMohole', function() {
  it('Should play', function() {
    const card = new SponsoredMohole();
    const player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player, player], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;
    kelvinists.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
