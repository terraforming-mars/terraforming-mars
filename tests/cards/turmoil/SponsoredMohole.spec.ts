import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/cards/turmoil/SponsoredMohole';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('SponsoredMohole', function() {
  it('Should play', function() {
    const card = new SponsoredMohole();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;
    kelvinists.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
