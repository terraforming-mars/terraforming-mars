import {expect} from 'chai';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {GiantSolarShade} from '../../../src/cards/venusNext/GiantSolarShade';
import {Game} from '../../../src/Game';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('GiantSolarShade', function() {
  it('Should play', function() {
    const card = new GiantSolarShade();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(6);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Should play with Reds and Dirigibles', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
        game.turmoil!.rulingParty = new Reds();
        const card = new GiantSolarShade();
        player.megaCredits = 27;
        expect(card.canPlay(player, game)).is.not.true;
        player.playedCards.push(new Dirigibles());
        player.addResourceTo(player.playedCards[0], 3);
        expect(card.canPlay(player, game)).is.true;
  });
});
