import {expect} from 'chai';
import {Factorum} from '../../../src/cards/promo/Factorum';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {SelectOption} from '../../../src/inputs/SelectOption';

describe('Factorum', function() {
  it('Should play', function() {
    const card = new Factorum();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    player.megaCredits = 10;

    player.setCorporationForTest(card);

    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(2);
    const orOptions = cast(action.options[1], SelectOption);

    orOptions.cb();
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(7);

    const orOptions2 = cast(action.options[0], SelectOption);
    orOptions2.cb();
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
