import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {ExtremeColdFungus} from '../../../src/cards/base/ExtremeColdFungus';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ExtremeColdFungus', () => {
  let card : ExtremeColdFungus; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new ExtremeColdFungus();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
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
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - single target', () => {
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

        action!.options[0].cb();
        expect(player.getResourcesOnCard(tardigrades)).to.eq(2);

        action!.options[1].cb();
        expect(player.plants).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

        action!.options[0].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(2);

        action!.options[0].cb([ants]);
        expect(player.getResourcesOnCard(ants)).to.eq(2);
  });
});
