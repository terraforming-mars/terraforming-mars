import {expect} from 'chai';
import {RobinHaulings} from '../../../src/cards/pathfinders/RobinHaulings';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('RobinHaulings', function() {
  let card: RobinHaulings;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RobinHaulings();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 0);
    player.corporationCard = card;
  });

  it('play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed', () => {
    expect(card.resourceCount).eq(0);

    player.playCard(TestingUtils.fakeCard({tags: [Tags.EARTH]}));

    expect(card.resourceCount).eq(0);

    player.playCard(TestingUtils.fakeCard({tags: [Tags.VENUS, Tags.VENUS]}));

    expect(card.resourceCount).eq(0);
  });

  it('onCardPlayed, other player', () => {
    expect(card.resourceCount).eq(0);

    player2.playCard(TestingUtils.fakeCard({tags: [Tags.EARTH]}));

    expect(card.resourceCount).eq(0);

    player2.playCard(TestingUtils.fakeCard({tags: [Tags.VENUS, Tags.VENUS]}));

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
    const action = card.action(player);

    expect(action).instanceOf(OrOptions);

    const orOptions = action as OrOptions;

    expect(orOptions.options).has.length(2);
    expect(game.getVenusScaleLevel()).eq(0);
    card.resourceCount = 4;

    orOptions.options[0].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('action, oxygen', () => {
    const action = card.action(player);

    expect(action).instanceOf(OrOptions);

    const orOptions = action as OrOptions;

    expect(orOptions.options).has.length(2);
    expect(game.getOxygenLevel()).eq(0);
    card.resourceCount = 4;

    orOptions.options[1].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getOxygenLevel()).eq(1);
  });
});
