import {expect} from 'chai';
import {ResearchColony} from '@/server/cards/colonies/ResearchColony';
import {Callisto} from '@/server/colonies/Callisto';
import {Ceres} from '@/server/colonies/Ceres';
import {Miranda} from '@/server/colonies/Miranda';
import {IGame} from '@/server/IGame';
import {SelectColony} from '@/server/inputs/SelectColony';
import {cast} from '@/common/utils/utils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('ResearchColony', () => {
  let card: ResearchColony;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ResearchColony();
    [game, player] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  it('Should play', () => {
    expect(player.cardsInHand).has.lengthOf(0);
    card.play(player);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(2);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const colony = selectColony.colonies[0];
    selectColony.cb(colony);

    expect(colony.colonies).includes(player.id);
  });

  it('Allows building on a colony the player already occupies', () => {
    const callisto = game.colonies[0];
    callisto.colonies.push(player.id);

    card.play(player);
    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).includes(callisto);

    selectColony.cb(callisto);
    expect(callisto.colonies).deep.eq([player.id, player.id]);
  });
});
