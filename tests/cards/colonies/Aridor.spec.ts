import {expect} from 'chai';
import {Predators} from '../../../src/cards/base/Predators';
import {ResearchOutpost} from '../../../src/cards/base/ResearchOutpost';
import {Aridor} from '../../../src/cards/colonies/Aridor';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Aridor', function() {
  it('Should play', function() {
    const card = new Aridor();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const play = card.play();
    expect(play).is.undefined;
    player.corporationCard = card;
    card.onCardPlayed(player, new Predators());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    card.onCardPlayed(player2, new ResearchOutpost());
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    card.onCardPlayed(player, new ResearchOutpost());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
