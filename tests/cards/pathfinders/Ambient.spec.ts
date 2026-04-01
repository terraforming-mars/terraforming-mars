import {expect} from 'chai';
import {Ambient} from '../../../src/server/cards/pathfinders/Ambient';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {fakeCard, runAllActions, setTemperature} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {MAX_TEMPERATURE} from '../../../src/common/constants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Phase} from '../../../src/common/Phase';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {cast, toName} from '../../../src/common/utils/utils';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {AndOptions} from '../../../src/server/inputs/AndOptions';

describe('Ambient', () => {
  let card: Ambient;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ambient();
    [game, player, player2] = testGame(2);
  });

  it('play', () => {
    player.playCorporationCard(card);
    expect(player.production.heat).eq(1);
  });

  it('initialAction', () => {
    expect(game.getVenusScaleLevel()).eq(0);
    expect(player.terraformRating).eq(20);

    player.defer(card.initialAction(player));
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.terraformRating).eq(22);
  });

  it('effect', () => {
    player.playedCards.push(card);
    expect(player.production.heat).eq(0);

    player.playCard(fakeCard({tags: []}));
    expect(player.production.heat).eq(0);

    player.playCard(fakeCard({tags: [Tag.EARTH]}));
    expect(player.production.heat).eq(0);

    player.playCard(fakeCard({tags: [Tag.VENUS]}));
    expect(player.production.heat).eq(1);
    expect(player2.production.heat).eq(0);

    player2.playCard(fakeCard({tags: [Tag.VENUS]}));
    expect(player.production.heat).eq(1);
    expect(player2.production.heat).eq(0);
  });

  it('canAct', () => {
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

    expect(player.terraformRating).eq(20);

    cast(card.action(player), undefined);

    expect(player.heat).eq(1);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(21);
  });

  it('action is repeatable', () => {
    player.playedCards.push(card);
    player.heat = 16;
    setTemperature(game, MAX_TEMPERATURE);

    const getBlueActions = () => {
      const orOptions = cast(player.getActions(), OrOptions);
      const option = orOptions.options.find((o) => o.title === 'Perform an action from a played card');
      return option === undefined ? undefined : cast(option, SelectCard);
    };

    expect(getBlueActions()!.cards.map(toName)).deep.eq([card.name]);

    expect(player.terraformRating).eq(20);

    getBlueActions()!.cb([card]);

    expect(player.heat).eq(8);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(21);

    expect(getBlueActions()).is.undefined;
    runAllActions(game);
    expect(getBlueActions()!.cards.map(toName)).deep.eq([card.name]);

    getBlueActions()!.cb([card]);

    expect(player.heat).eq(0);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(22);

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
      player.playedCards.push(card);
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

  it('Compatible with Stormcraft Incorporated', () => {
    [game, player, player2] = testGame(2);
    player.playedCards.push(card);
    const stormcraft = new StormCraftIncorporated();
    player.playedCards.push(stormcraft);
    player.canUseHeatAsMegaCredits = true;
    player.game.phase = Phase.ACTION;
    setTemperature(game, MAX_TEMPERATURE);

    player.heat = 4;
    stormcraft.resourceCount = 1;

    expect(card.canAct(player)).is.false;

    stormcraft.resourceCount = 2;

    expect(card.canAct(player)).is.true;

    player.heat = 5;
    stormcraft.resourceCount = 3;

    const andOptions = cast(card.action(player), AndOptions);

    andOptions.options[0].cb(4);
    andOptions.options[1].cb(2);
    andOptions.cb(undefined);

    expect(player.heat).eq(1);
    expect(stormcraft.resourceCount).eq(1);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(21);
  });
});
