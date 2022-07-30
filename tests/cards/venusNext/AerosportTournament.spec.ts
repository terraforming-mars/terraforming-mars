import {expect} from 'chai';
import {AerosportTournament} from '../../../src/cards/venusNext/AerosportTournament';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AerosportTournament', function() {
  it('Should play', function() {
    const card = new AerosportTournament();
    const corp = new Celestic();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.setCorporationForTest(corp);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    game.addCityTile(player, '03');

    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.megaCredits).to.eq(1);
  });
});
