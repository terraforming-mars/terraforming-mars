import {expect} from 'chai';
import {cast, churn, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Thermophiles', () => {
  let card: Thermophiles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Thermophiles();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    setVenusScaleLevel(game, 4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 6);
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Should act - multiple targets', () => {
    card.play(player);
    player.playedCards.push(card, new VenusianInsects());

    card.action(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card]);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card);

    const orOptions = cast(churn(card.action(player), player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should act - single target', () => {
    card.play(player);
    player.playedCards.push(card);

    const action = card.action(player);
    cast(action, undefined);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card);

    const orOptions = cast(churn(card.action(player), player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
