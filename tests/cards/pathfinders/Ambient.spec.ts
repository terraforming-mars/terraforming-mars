import {expect} from 'chai';
import {Ambient} from '../../../src/server/cards/pathfinders/Ambient';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {MAX_TEMPERATURE} from '../../../src/common/constants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('Ambient', function() {
  let card: Ambient;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Ambient();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(card);
  });

  it('initialAction', function() {
    expect(game.getVenusScaleLevel()).eq(0);
    expect(player.getTerraformRating()).eq(20);

    card.initialAction(player);

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
    (game as any).temperature = MAX_TEMPERATURE;

    expect(card.canAct(player)).is.false;

    player.heat = 8;
    (game as any).temperature = MAX_TEMPERATURE - 2;
    expect(card.canAct(player)).is.false;


    player.heat = 8;
    (game as any).temperature = MAX_TEMPERATURE;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.heat = 9;
    (game as any).temperature = MAX_TEMPERATURE;

    expect(player.getTerraformRating()).eq(20);

    card.action(player);

    expect(player.heat).eq(1);
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.getTerraformRating()).eq(21);
  });

  it('action is repeatable', () => {
    player.heat = 16;
    (game as any).temperature = MAX_TEMPERATURE;

    const getBlueActions = function() {
      const actions = cast(player.getActions(), OrOptions);
      if (actions.options[0].title === 'Perform an action from a played card') {
        return cast(actions.options[0], SelectCard);
      }
      return undefined;
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
});
