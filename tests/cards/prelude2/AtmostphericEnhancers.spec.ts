import {expect} from 'chai';
import {AtmosphericEnhancers} from '../../../src/server/cards/prelude2/AtmosphericEnhancers';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IGame} from '../../../src/server/IGame';
import {floaterCards} from '../../../src/server/cards/venusNext/floaterCards';

describe('AtmosphericEnhancers', () => {
  let card: AtmosphericEnhancers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AtmosphericEnhancers();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('play - raise temperature', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(game.getTemperature()).eq(-30);

    cast(player.popWaitingFor(), OrOptions).options[0].cb();
    runAllActions(game);

    expect(game.getTemperature()).eq(-26);
  });

  it('play - raise oxygen', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(game.getOxygenLevel()).eq(0);

    cast(player.popWaitingFor(), OrOptions).options[1].cb();
    runAllActions(game);

    expect(game.getOxygenLevel()).eq(2);
  });

  it('play - raise Venus', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(0);

    cast(player.popWaitingFor(), OrOptions).options[2].cb();
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(4);
  });

  it('play - cards have floaters', () => {
    cast(card.play(player), undefined);
    expect(player.cardsInHand).has.length(2);

    expect(floaterCards.has(player.cardsInHand[0].name));
    expect(floaterCards.has(player.cardsInHand[1].name));
  });
});
