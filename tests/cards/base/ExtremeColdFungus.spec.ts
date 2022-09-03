import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {ExtremeColdFungus} from '../../../src/server/cards/base/ExtremeColdFungus';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ExtremeColdFungus', () => {
  let card: ExtremeColdFungus;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(() => {
    card = new ExtremeColdFungus();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot play', () => {
    (game as any).temperature = -8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    (game as any).temperature = -12;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - single target', () => {
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    const action = cast(card.action(player), OrOptions);
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

    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(2);

    action.options[0].cb([ants]);
    expect(ants.resourceCount).to.eq(2);
  });
});
