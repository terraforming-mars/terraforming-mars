import {expect} from 'chai';
import {ConvertPlants} from '../../../../src/server/cards/base/standardActions/ConvertPlants';
import {Phase} from '../../../../src/common/Phase';
import {setOxygenLevel} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {MAX_OXYGEN_LEVEL} from '../../../../src/common/constants';

describe('ConvertPlants', () => {
  let card: ConvertPlants;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ConvertPlants();
    player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player, {turmoilExtension: true});
  });

  it('Can not act without plants', () => {
    expect(card.canAct(player)).eq(false);
    player.plants = 7;
    expect(card.canAct(player)).eq(false);
  });

  it('Can not act with reds', () => {
    player.plants = 8;
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 2;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 3;
    expect(card.canAct(player)).eq(true);
  });

  it('Should play', () => {
    player.plants = 8;

    expect(card.canAct(player)).eq(true);
    const action = card.action(player);
    expect(action).not.eq(undefined);
    action.cb(action.spaces[0]);

    expect(player.game.getOxygenLevel()).eq(1);
  });

  it('Can act when maximized', () => {
    player.plants = 8;
    expect(card.canAct(player)).eq(true);
    setOxygenLevel(player.game, MAX_OXYGEN_LEVEL);
    expect(card.canAct(player)).eq(true);
  });
});
