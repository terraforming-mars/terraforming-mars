import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {EarlyColonization} from '../../../src/server/cards/prelude2/EarlyColonization';
import {assertBuildColony} from '../../colonies/coloniesAssertions';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Enceladus} from '../../../src/server/colonies/Enceladus';
import {Ganymede} from '../../../src/server/colonies/Ganymede';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';

describe('EarlyColonization', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: EarlyColonization;

  beforeEach(() => {
    [game, player] = testGame(1, {coloniesExtension: true});
    card = new EarlyColonization();
  });

  it('play', () => {
    const [callisto, enceladus, ganymede, luna] = [new Callisto(), new Enceladus(), new Ganymede(), new Luna()];
    game.colonies = [callisto, enceladus, ganymede, luna];
    const colonies = game.colonies;

    ganymede.colonies.push(player.id);
    expect(enceladus.isActive).is.false;

    expect(colonies.map((c) => c.trackPosition)).deep.eq([1, 1, 1, 1]);

    card.play(player);

    expect(colonies.map((c) => c.trackPosition)).deep.eq([3, 1, 3, 3]);
    expect(player.energy).eq(3);
    assertBuildColony(player, game.deferredActions.pop()!.execute());

    enceladus.isActive = true;

    card.play(player);

    expect(colonies.map((c) => c.trackPosition)).deep.eq([5, 3, 5, 5]);
  });
});
