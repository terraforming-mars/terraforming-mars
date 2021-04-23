import {expect} from 'chai';
import {EosChasmaNationalPark} from '../../../src/cards/base/EOSChasmaNationalPark';
import {Fish} from '../../../src/cards/base/Fish';
import {Predators} from '../../../src/cards/base/Predators';
import {MeatIndustry} from '../../../src/cards/promo/MeatIndustry';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('MeatIndustry', function() {
  it('Gives 2 M€ whenever player gains an animal', function() {
    const card = new MeatIndustry();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card);

    // Get 2 M€ when player gains animals
    const fish = new Fish();
    player.playedCards.push(fish);
    fish.action(player);
    expect(player.megaCredits).to.eq(2);

    const eosChasmaNationalPark = new EosChasmaNationalPark();
    eosChasmaNationalPark.play(player);
    expect(fish.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(4);

    // Don't get MC when other players gain animals
    const predators = new Predators();
    player2.playedCards.push(predators);
    predators.action(player2);
    expect(player.megaCredits).to.eq(4);
  });
});
