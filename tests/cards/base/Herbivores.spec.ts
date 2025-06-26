import {expect} from 'chai';
import {Herbivores} from '../../../src/server/cards/base/Herbivores';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Resource} from '../../../src/common/Resource';
import {addGreenery, cast, runAllActions, runNextAction, setOxygenLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Herbivores', () => {
  let card: Herbivores;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Herbivores();
    [game, player, player2] = testGame(2);
  });

  it('Can not play if nobody has plant production', () => {
    setOxygenLevel(game, 8);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too low', () => {
    setOxygenLevel(game, 7);
    player2.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - auto select if single target', () => {
    setOxygenLevel(game, 8);
    player2.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    const input = runNextAction(game);
    expect(input).is.undefined;
    expect(player2.production.plants).to.eq(0);
  });

  it('Should play - multiple targets', () => {
    player.production.add(Resource.PLANTS, 1);
    player2.production.add(Resource.PLANTS, 1);

    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.plants).to.eq(0);
  });

  it('Should add resources', () => {
    player.playedCards.push(card);
    expect(card.resourceCount).to.eq(0);

    addGreenery(player);
    addGreenery(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);

    addGreenery(player2);
    runNextAction(game);
    expect(card.resourceCount).to.eq(2); // i.e. not changed

    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should be playable in solo mode', () => {
    [game, player] = testGame(1);
    setOxygenLevel(game, 8);
    player.production.add(Resource.PLANTS, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(1); // should not decrease
  });
});
