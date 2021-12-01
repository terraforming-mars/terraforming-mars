import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../../src/cards/base/standardProjects/AsteroidStandardProject';
import {TestingUtils} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/Game';
import {TestPlayers} from '../../../TestPlayers';
import {PoliticalAgendas} from '../../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/turmoil/parties/Reds';
import {Phase} from '../../../../src/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../../src/constants';

describe('AsteroidStandardProject', function() {
  let card: AsteroidStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AsteroidStandardProject();
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
    expect(game.getTemperature()).eq(-30);

    card.action(player);
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getTemperature()).eq(-28);
  });

  it('Can not act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;
    expect(card.canAct(player)).is.true;
  });

  it('Can not act with reds', () => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({turmoilExtension: true}));

    player.megaCredits = card.cost;
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
