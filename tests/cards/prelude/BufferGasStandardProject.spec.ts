import {expect} from 'chai';
import {BufferGasStandardProject} from '../../../src/cards/prelude/BufferGasStandardProject';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {Phase} from '../../../src/Phase';

describe('BufferGasStandardProject', function() {
  let card: BufferGasStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BufferGasStandardProject();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can act', function() {
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);

    card.action(player);
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Can not act with reds', () => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({turmoilExtension: true}));

    player.megaCredits = card.cost;
    player.setTerraformRating(20);
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = card.cost + 2;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = card.cost + 3;
    expect(card.canAct(player)).eq(true);
  });
});
