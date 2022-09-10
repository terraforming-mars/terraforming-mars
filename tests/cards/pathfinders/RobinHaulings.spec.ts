import {expect} from 'chai';
import {RobinHaulings} from '../../../src/server/cards/pathfinders/RobinHaulings';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

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
    player.setCorporationForTest(card);
  });

  it('play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
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
    const orOptions = cast(card.action(player), OrOptions);

    expect(orOptions.options).has.length(2);
    expect(game.getVenusScaleLevel()).eq(0);
    card.resourceCount = 4;

    orOptions.options[0].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('action, oxygen', () => {
    const orOptions = cast(card.action(player), OrOptions);

    expect(orOptions.options).has.length(2);
    expect(game.getOxygenLevel()).eq(0);
    card.resourceCount = 4;

    orOptions.options[1].cb();

    expect(card.resourceCount).eq(1);
    expect(game.getOxygenLevel()).eq(1);
  });
});
