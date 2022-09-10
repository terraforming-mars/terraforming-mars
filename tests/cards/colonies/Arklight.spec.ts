import {expect} from 'chai';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('Arklight', function() {
  it('Should play', function() {
    const card = new Arklight();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const play = card.play(player);
    expect(play).is.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    player.setCorporationForTest(card);
    card.onCardPlayed(player, new Predators());
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
