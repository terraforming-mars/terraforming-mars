import {expect} from 'chai';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {GiantSolarShade} from '../../../src/cards/venusNext/GiantSolarShade';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
let card: GiantSolarShade;
let player: Player;
let redPlayer: Player;
let game: Game;

describe('GiantSolarShade', function() {
  beforeEach(() => {
    card = new GiantSolarShade();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();

    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(6);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Should play with Reds and Dirigibles', function() {
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    player.megaCredits = 27;
    expect(card.canPlay(player, game)).is.not.true;
    player.playedCards.push(new Dirigibles());
    player.addResourceTo(player.playedCards[0], 3);
    expect(card.canPlay(player, game)).is.true;
  });
});
