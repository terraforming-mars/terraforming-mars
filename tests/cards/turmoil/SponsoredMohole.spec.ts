import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/cards/turmoil/SponsoredMohole';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('SponsoredMohole', function() {
  it('Should play', function() {
    const card = new SponsoredMohole();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    expect(card.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;
    kelvinists.delegates.push(player.id, player.id);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
