import {expect} from 'chai';
import {ConvertHeat} from '../../../../src/server/cards/base/standardActions/ConvertHeat';
import {Phase} from '../../../../src/common/Phase';
import {churnAction, setTemperature} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {MAX_TEMPERATURE} from '../../../../src/common/constants';
import {testGame} from '../../../TestGame';

describe('ConvertHeat', function() {
  let card: ConvertHeat;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ConvertHeat();
    [/* game */, player] = testGame(2, {turmoilExtension: true});
  });

  it('Can not act without heat', function() {
    expect(card.canAct(player)).eq(false);
    player.heat = 7;
    expect(card.canAct(player)).eq(false);
  });

  it('Can not act with reds', function() {
    player.heat = 8;
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 2;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 3;
    expect(card.canAct(player)).eq(true);
  });

  it('Should play', function() {
    player.heat = 8;
    expect(card.canAct(player)).eq(true);
    expect(churnAction(card, player)).eq(undefined);
    expect(player.game.getTemperature()).eq(-28);
  });

  it('Can not act when maximized', function() {
    player.heat = 8;
    expect(card.canAct(player)).eq(true);
    setTemperature(player.game, MAX_TEMPERATURE);
    expect(card.canAct(player)).eq(false);
  });
});
