import {expect} from 'chai';
import {ConvertHeat} from '../../../../src/server/cards/base/standardActions/ConvertHeat';
import {Phase} from '../../../../src/common/Phase';
import {cast, churn, setTemperature} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {MAX_TEMPERATURE} from '../../../../src/common/constants';
import {testGame} from '../../../TestGame';
import {IGame} from '../../../../src/server/IGame';

describe('ConvertHeat', () => {
  let card: ConvertHeat;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ConvertHeat();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Can not act without heat', () => {
    expect(card.canAct(player)).eq(false);
    player.heat = 7;
    expect(card.canAct(player)).eq(false);
  });

  it('Can not act with reds', () => {
    player.heat = 8;
    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 2;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = 3;
    expect(card.canAct(player)).eq(true);
  });

  it('Should play', () => {
    player.heat = 8;
    expect(card.canAct(player)).eq(true);
    expect(churn(card.action(player), player)).eq(undefined);
    expect(game.getTemperature()).eq(-28);
  });

  it('Spending heat when the global parameter is at its goal is a valid stall action', () => {
    player.heat = 8;

    expect(card.canAct(player)).eq(true);

    setTemperature(game, MAX_TEMPERATURE);

    expect(player.getTerraformRating()).eq(20);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);

    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.heat).eq(0);
    expect(player.getTerraformRating()).eq(20);
  });
});
