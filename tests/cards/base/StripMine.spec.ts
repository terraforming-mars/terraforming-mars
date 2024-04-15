import {expect} from 'chai';
import {StripMine} from '../../../src/server/cards/base/StripMine';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {Resource} from '../../../src/common/Resource';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';

describe('StripMine', function() {
  let card: StripMine;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new StripMine();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, redPlayer], player, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can not play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
    expect(player.production.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });

  it('Cannot play if Reds are ruling and cannot afford 6 MC', function() {
    player.production.add(Resource.ENERGY, 2);
    player.megaCredits = card.cost;
    player.game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(player.canPlay(card)).is.false;

    player.megaCredits += 6; // Payment for Reds tax
    expect(player.canPlay(card)).deep.eq({redsCost: 6});

    player.megaCredits = 5; // Cannot play as cannot afford Reds tax in MC
    player.steel = 30;
    expect(player.canPlay(card)).is.false;
  });
});
