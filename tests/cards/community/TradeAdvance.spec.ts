import {expect} from 'chai';
import {TradeAdvance} from '../../../src/server/cards/community/TradeAdvance';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {IGame} from '../../../src/server/IGame';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('TradeAdvance', () => {
  let card: TradeAdvance;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TradeAdvance();
    [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [ColonyName.LUNA, ColonyName.CALLISTO, ColonyName.CERES, ColonyName.IO, ColonyName.TITAN],
    });
  });

  it('Should play', () => {
    card.play(player);

    runAllActions(player.game);

    expect(player.megaCredits).to.eq(6); // 2 from card + 4 from Luna
    expect(player.energy).to.eq(3);
    expect(player.steel).to.eq(3);
    expect(player.heat).to.eq(4);
    game.colonies.forEach((colony) => {
      if (colony.isActive) {
        expect(colony.trackPosition).to.eq(0);
      } else {
        expect(colony.trackPosition).to.eq(1);
      }
    });
  });
});
