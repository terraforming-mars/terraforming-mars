import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ImpactorSwarm} from '../../../src/server/cards/colonies/ImpactorSwarm';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ImpactorSwarm', () => {
  let card: ImpactorSwarm;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ImpactorSwarm();
    [game, player, player2] = testGame(2);
  });

  it('Should play when no other player has plants', () => {
    cast(card.play(player), undefined);
    expect(player.heat).to.eq(12);
  });

  it('Should be able to remove plants from other player', () => {
    player2.plants = 2;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
    expect(player.heat).to.eq(12);
  });
});
