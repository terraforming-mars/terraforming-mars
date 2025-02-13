import {expect} from 'chai';
import {StripMine} from '../../../src/server/cards/base/StripMine';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {Resource} from '../../../src/common/Resource';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('StripMine', () => {
  let card: StripMine;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new StripMine();
    [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can not play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
    expect(player.production.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });

  it('Cannot play if Reds are ruling and cannot afford 6 MC', () => {
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
