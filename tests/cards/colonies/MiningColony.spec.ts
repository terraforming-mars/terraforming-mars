import {expect} from 'chai';
import {MiningColony} from '@/server/cards/colonies/MiningColony';
import {Callisto} from '@/server/colonies/Callisto';
import {Ceres} from '@/server/colonies/Ceres';
import {Miranda} from '@/server/colonies/Miranda';
import {IGame} from '@/server/IGame';
import {SelectColony} from '@/server/inputs/SelectColony';
import {cast} from '@/common/utils/utils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('MiningColony', () => {
  let card: MiningColony;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MiningColony();
    [game, player] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  it('Should play', () => {
    card.play(player);
    runAllActions(game);
    expect(player.production.titanium).to.eq(1);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const colony = selectColony.colonies[0];
    selectColony.cb(colony);

    expect(colony.colonies).includes(player.id);
  });
});
