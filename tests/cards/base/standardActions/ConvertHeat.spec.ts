import {expect} from 'chai';
import {ConvertHeat} from '../../../../src/cards/base/standardActions/ConvertHeat';
import {Phase} from '../../../../src/Phase';
import {Player} from '../../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../../TestingUtils';
import {Game} from '../../../../src/Game';
import {PoliticalAgendas} from '../../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/turmoil/parties/Reds';

describe('ConvertHeat', function() {
  let card: ConvertHeat; let player: Player;

  beforeEach(function() {
    card = new ConvertHeat();
    player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player, setCustomGameOptions());
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
  });

  it('Should play', function() {
    player.heat = 8;
    expect(card.canAct(player)).eq(true);
    expect(card.action(player)).eq(undefined);
    expect(player.game.getTemperature()).eq(-28);
  });
});
