import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/cards/turmoil/SponsoredMohole';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SponsoredMohole', function() {
  it('Should play', function() {
    const card = new SponsoredMohole();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;
    kelvinists.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
