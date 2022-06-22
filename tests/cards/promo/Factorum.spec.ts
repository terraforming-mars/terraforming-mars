import {expect} from 'chai';
import {Factorum} from '../../../src/cards/promo/Factorum';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Factorum', function() {
  it('Should play', function() {
    const card = new Factorum();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    player.megaCredits = 10;

    player.corporationCard = card;

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    if ( ! (action instanceof OrOptions)) return;

    expect(action.options).has.lengthOf(2);
    const orOptions = action.options[1] as OrOptions;

    orOptions.cb();
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(7);

    const orOptions2 = action.options[0] as OrOptions;
    orOptions2.cb();
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
