import {expect} from 'chai';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {GiantSolarShade} from '../../../src/server/cards/venusNext/GiantSolarShade';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('GiantSolarShade', function() {
  let card: GiantSolarShade;
  let player: TestPlayer;
  let redPlayer: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new GiantSolarShade();
    player = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, redPlayer], player, {venusNextExtension: true, turmoilExtension: true});
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
    expect(game.getVenusScaleLevel()).to.eq(6);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Should play with Reds and Dirigibles', function() {
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    player.megaCredits = 27;
    expect(player.canPlay(card)).is.not.true;
    player.playedCards.push(new Dirigibles());
    player.addResourceTo(player.playedCards[0], 3);
    expect(player.canPlay(card)).deep.eq({redsCost: 9});
  });
});
