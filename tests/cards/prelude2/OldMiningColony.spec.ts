import {expect} from 'chai';
import {OldMiningColony} from '@/server/cards/prelude2/OldMiningColony';
import {Research} from '@/server/cards/base/Research';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {Callisto} from '@/server/colonies/Callisto';
import {Ceres} from '@/server/colonies/Ceres';
import {Miranda} from '@/server/colonies/Miranda';
import {IGame} from '@/server/IGame';
import {ICard} from '@/server/cards/ICard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {SelectColony} from '@/server/inputs/SelectColony';
import {cast} from '@/common/utils/utils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('OldMiningColony', () => {
  let card: OldMiningColony;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OldMiningColony();
    [game, player] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.false;

    player.cardsInHand.push(new Research());
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const research = new Research();
    const tardigrades = new Tardigrades();
    player.cardsInHand.push(research, tardigrades);

    card.play(player);
    runAllActions(game);
    expect(player.production.titanium).to.eq(1);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const colony = selectColony.colonies[0];
    selectColony.cb(colony);
    runAllActions(game);

    expect(colony.colonies).includes(player.id);

    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCard.cb([research]);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).to.eq(tardigrades);
  });
});
