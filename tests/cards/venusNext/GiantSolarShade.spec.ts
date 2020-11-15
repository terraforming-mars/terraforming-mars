
import {expect} from 'chai';
import {GiantSolarShade} from '../../../src/cards/venusNext/GiantSolarShade';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';

describe('GiantSolarShade', function() {
  it('Should play', function() {
    const card = new GiantSolarShade();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(6);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Should play with Reds and Dirigibles', function() {
    const player = new Player('test', Color.BLUE, false);
    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player], player, gameOptions);
        game.turmoil!.rulingParty = new Reds();
        const card = new GiantSolarShade();
        player.megaCredits = 27;
        expect(card.canPlay(player, game)).is.not.true;
        player.playedCards.push(new Dirigibles());
        player.addResourceTo(player.playedCards[0], 3);
        expect(card.canPlay(player, game)).is.true;
  });
});
