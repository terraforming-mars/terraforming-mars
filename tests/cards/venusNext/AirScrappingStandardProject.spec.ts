import {expect} from 'chai';
import {AirScrappingStandardProject} from '../../../src/server/cards/venusNext/AirScrappingStandardProject';
import {cast, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../src/common/Phase';
import {MAX_VENUS_SCALE} from '../../../src/common/constants';
import {testGame} from '../../TestGame';

describe('AirScrappingStandardProject', function() {
  let card: AirScrappingStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AirScrappingStandardProject();
    [game, player/* , player2 */] = testGame(2, {venusNextExtension: true, altVenusBoard: false, turmoilExtension: true});
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

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.megaCredits = 15;
    expect(card.canAct(player)).eq(true);

    setVenusScaleLevel(game, MAX_VENUS_SCALE);

    expect(player.getTerraformRating()).eq(20);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(MAX_VENUS_SCALE);
    expect(player.getTerraformRating()).eq(20);
    expect(player.megaCredits).eq(0);
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
