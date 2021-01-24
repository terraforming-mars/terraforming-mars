import {expect} from 'chai';
import {StripMine} from '../../../src/cards/base/StripMine';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('StripMine', function() {
  let card : StripMine; let player : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new StripMine();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();

    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });

  it('Cannot play if Reds are ruling and cannot afford 6 MC', function() {
    player.addProduction(Resources.ENERGY, 2);
    player.megaCredits = card.cost;
    player.game.phase = Phase.ACTION;

    const reds = new Reds();
    turmoil.rulingParty = reds;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canPlay(player)).is.false;

    player.megaCredits += REDS_RULING_POLICY_COST * 2; // Payment for Reds tax
    expect(card.canPlay(player)).is.true;

    player.megaCredits = 5; // Cannot play as cannot afford Reds tax in MC
    player.steel = 30;
    expect(card.canPlay(player)).is.false;
  });
});
