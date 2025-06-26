import {expect} from 'chai';
import {AtmosphericEnhancers} from '../../../src/server/cards/prelude2/AtmosphericEnhancers';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel, setRulingParty, setTemperature, setVenusScaleLevel} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IGame} from '../../../src/server/IGame';
import {floaterCards} from '../../../src/server/cards/venusNext/floaterCards';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '../../../src/common/constants';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('AtmosphericEnhancers', () => {
  let card: AtmosphericEnhancers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AtmosphericEnhancers();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.true;

    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    setVenusScaleLevel(game, MAX_VENUS_SCALE);

    expect(card.canPlay(player)).is.true;
  });

  it('canPlay, turmoil', () => {
    const [turmoilGame, turmoilPlayer] = testGame(1, {venusNextExtension: true, turmoilExtension: true});
    turmoilPlayer.megaCredits = 5;

    expect(card.canPlay(turmoilPlayer)).is.true;

    setRulingParty(turmoilGame, PartyName.REDS);

    expect(card.canPlay(turmoilPlayer)).is.false;

    turmoilPlayer.megaCredits = 6;

    expect(card.canPlay(turmoilPlayer)).is.true;
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
