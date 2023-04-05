import {expect} from 'chai';
import {cast, churnAction, setTemperature} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {ExtremeColdFungus} from '../../../src/server/cards/base/ExtremeColdFungus';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ExtremeColdFungus', () => {
  let card: ExtremeColdFungus;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ExtremeColdFungus();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    setTemperature(game, -8);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play', () => {
    setTemperature(game, -12);
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', () => {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - single target', () => {
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    const action = cast(churnAction(card, player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb();
    expect(tardigrades.resourceCount).to.eq(2);

    action.options[1].cb();
    expect(player.plants).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);

    const action = cast(churnAction(card, player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(2);

    action.options[0].cb([ants]);
    expect(ants.resourceCount).to.eq(2);
  });
});
