import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {TradeAdvance} from '../../../src/cards/community/TradeAdvance';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game, GameOptions} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';

describe('TradeAdvance', function() {
  let card : TradeAdvance; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TradeAdvance();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions({
      coloniesExtension: true,
      customColoniesList: [ColonyName.LUNA, ColonyName.CALLISTO, ColonyName.CERES, ColonyName.IO, ColonyName.TITAN],
    }) as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);

    game.deferredActions.runAll(() => {});

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
