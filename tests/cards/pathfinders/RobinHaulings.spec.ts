import {expect} from 'chai';
import {RobinHaulings} from '../../../src/server/cards/pathfinders/RobinHaulings';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {churn, fakeCard, runAllActions, setOxygenLevel, setVenusScaleLevel} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../../src/common/utils/utils';
import {MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '@/common/constants';

describe('RobinHaulings', () => {
  let card: RobinHaulings;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new RobinHaulings();
    [game, player, player2] = testGame(2);
  });

  it('play', () => {
    expect(card.resourceCount).eq(0);
    player.playCorporationCard(card);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed', () => {
    expect(card.resourceCount).eq(0);

    player.playCard(fakeCard({tags: [Tag.EARTH]}));

    expect(card.resourceCount).eq(0);

    player.playCard(fakeCard({tags: [Tag.VENUS, Tag.VENUS]}));

    expect(card.resourceCount).eq(0);
  });

  it('onCardPlayed, other player', () => {
    expect(card.resourceCount).eq(0);

    player2.playCard(fakeCard({tags: [Tag.EARTH]}));

    expect(card.resourceCount).eq(0);

    player2.playCard(fakeCard({tags: [Tag.VENUS, Tag.VENUS]}));

    expect(card.resourceCount).eq(0);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;
    card.resourceCount = 2;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action, venus', () => {
    card.resourceCount = 4;
    const orOptions = cast(churn(card.action(player), player), OrOptions);

    expect(orOptions.options).has.length(2);
    expect(game.getVenusScaleLevel()).eq(0);

    orOptions.options[0].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('action, oxygen', () => {
    card.resourceCount = 4;
    const orOptions = cast(churn(card.action(player), player), OrOptions);

    expect(orOptions.options).has.length(2);
    expect(game.getOxygenLevel()).eq(0);

    orOptions.options[1].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('Shows a warning on the card when both global parameters are at max', () => {
    card.resourceCount = 4;
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    setVenusScaleLevel(game, MAX_VENUS_SCALE);

    // The action is still offered (spending the floaters is a no-op, not blocked), but
    // canExecute flags the card itself, not the individual OrOptions choices.
    const orOptions = cast(churn(card.action(player), player), OrOptions);
    expect(orOptions.options).has.length(2);
    expect(card.warnings).deep.eq(new Set(['maxvenus', 'maxoxygen']));
  });
});
