import {expect} from 'chai';
import {Ambient} from '../../../src/server/cards/pathfinders/Ambient';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions, setTemperature} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {MAX_TEMPERATURE} from '../../../src/common/constants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Phase} from '../../../src/common/Phase';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';

describe('Ambient', function() {
  let card: Ambient;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Ambient();
    [game, player, player2] = testGame(2);
    player.corporations.push(card);
  });

  it('initialAction', function() {
    expect(game.getVenusScaleLevel()).eq(0);
    expect(player.getTerraformRating()).eq(20);

    player.deferInitialAction(card);
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.getTerraformRating()).eq(22);
  });

  it('onCardPlayed', function() {
    expect(player.production.heat).eq(0);

    card.onCardPlayed(player, fakeCard({tags: []}));
    expect(player.production.heat).eq(0);

    card.onCardPlayed(player, fakeCard({tags: [Tag.EARTH]}));
    expect(player.production.heat).eq(0);

    card.onCardPlayed(player, fakeCard({tags: [Tag.VENUS]}));
    expect(player.production.heat).eq(1);
    expect(player2.production.heat).eq(0);

    card.onCardPlayed(player2, fakeCard({tags: [Tag.VENUS]}));
    expect(player.production.heat).eq(1);
    expect(player2.production.heat).eq(0);
  });

  it('canAct', function() {
    player.heat = 7;
    setTemperature(game, MAX_TEMPERATURE);

    expect(card.canAct(player)).is.false;

    player.heat = 8;
    setTemperature(game, MAX_TEMPERATURE - 2);
    expect(card.canAct(player)).is.false;


    player.heat = 8;
    setTemperature(game, MAX_TEMPERATURE);
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.heat = 9;
    setTemperature(game, MAX_TEMPERATURE);

    expect(player.getTerraformRating()).eq(20);

    card.action(player);

    expect(player.heat).eq(1);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.getTerraformRating()).eq(21);
  });

  it('action is repeatable', () => {
    player.heat = 16;
    setTemperature(game, MAX_TEMPERATURE);

    const getBlueActions = function() {
      const orOptions = cast(player.getActions(), OrOptions);
      const option = orOptions.options.find((o) => o.title === 'Perform an action from a played card');
      return option === undefined ? undefined : cast(option, SelectCard);
    };

    expect(getBlueActions()!.cards.map((c) => (c as any).name)).deep.eq([card.name]);

    expect(player.getTerraformRating()).eq(20);

    getBlueActions()!.cb([card]);

    expect(player.heat).eq(8);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.getTerraformRating()).eq(21);

    expect(getBlueActions()).is.undefined;
    runAllActions(game);
    expect(getBlueActions()!.cards.map((c) => (c as any).name)).deep.eq([card.name]);

    getBlueActions()!.cb([card]);

    expect(player.heat).eq(0);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.getTerraformRating()).eq(22);

    expect(getBlueActions()).is.undefined;
    runAllActions(game);
    expect(getBlueActions()).is.undefined;
  });

  const redsRuns = [
    {heat: 8, mc: 3, expected: true},
    {heat: 11, mc: 0, expected: true},
    {heat: 8, mc: 0, expected: false},
  ];
  for (const run of redsRuns) {
    it('is compatible with Reds + Helion ' + JSON.stringify(run), () => {
      [game, player, player2] = testGame(2, {turmoilExtension: true});
      player.corporations.push(card);
      player.canUseHeatAsMegaCredits = true;
      player.game.phase = Phase.ACTION;
      const turmoil = Turmoil.getTurmoil(game);
      turmoil.rulingParty = new Reds();
      PoliticalAgendas.setNextAgenda(turmoil, player.game);
      setTemperature(game, MAX_TEMPERATURE);
      player.heat = run.heat;
      player.megaCredits = run.mc;
      expect(card.canAct(player)).eq(run.expected);
    });
  }
});
