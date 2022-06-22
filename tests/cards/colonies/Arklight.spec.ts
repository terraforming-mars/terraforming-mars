import {expect} from 'chai';
import {Predators} from '../../../src/cards/base/Predators';
import {Arklight} from '../../../src/cards/colonies/Arklight';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Arklight', function() {
  it('Should play', function() {
    const card = new Arklight();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const play = card.play(player);
    expect(play).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.corporationCard = card;
    card.onCardPlayed(player, new Predators());
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
