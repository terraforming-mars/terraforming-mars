import {expect} from 'chai';
import {AirScrappingStandardProject} from '../../../src/server/cards/venusNext/AirScrappingStandardProject';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../src/common/Phase';
import {MAX_VENUS_SCALE} from '../../../src/common/constants';

describe('AirScrappingStandardProject', function() {
  let card: AirScrappingStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AirScrappingStandardProject();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({venusNextExtension: true, altVenusBoard: false, turmoilExtension: true}));
  });

  it('Can act', function() {
    player.megaCredits = 14;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 15;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.megaCredits = 15;
    player.setTerraformRating(20);
    expect(game.getVenusScaleLevel()).eq(0);

    card.action(player);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('Cannot act when maximized', () => {
    player.megaCredits = 15;
    expect(card.canAct(player)).is.true;
    (game as any).venusScaleLevel = MAX_VENUS_SCALE;
    expect(card.canAct(player)).is.false;
  });

  it('Can not act with reds', () => {
    player.megaCredits = 15;
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 17;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 18;
    expect(card.canAct(player)).eq(true);
  });
});
