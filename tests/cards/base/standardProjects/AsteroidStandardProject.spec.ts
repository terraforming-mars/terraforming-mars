import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {cast, runAllActions, setTemperature} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../../src/common/Phase';
import {MAX_TEMPERATURE} from '../../../../src/common/constants';
import {testGame} from '../../../TestGame';

describe('AsteroidStandardProject', function() {
  let card: AsteroidStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AsteroidStandardProject();
    [game, player] = testGame(2);
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
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getTemperature()).eq(-28);
  });

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.megaCredits = 14;
    expect(card.canAct(player)).eq(true);

    setTemperature(game, MAX_TEMPERATURE);

    expect(player.getTerraformRating()).eq(20);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.getTerraformRating()).eq(20);
    expect(player.megaCredits).eq(0);
  });

  it('Can not act with reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});

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
