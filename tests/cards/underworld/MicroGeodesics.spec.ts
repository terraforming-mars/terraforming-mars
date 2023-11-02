import {expect} from 'chai';
import {MicroGeodesics} from '../../../src/server/cards/underworld/MicroGeodesics';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';

describe('MicroGeodesics', () => {
  let card: MicroGeodesics;
  let game: IGame;
  let player: TestPlayer;
  let ants: Ants;
  let cryptoCurrency: Cryptocurrency;

  beforeEach(() => {
    card = new MicroGeodesics();
    [game, player] = testGame(2, {underworldExpansion: true});
    ants = new Ants();
    cryptoCurrency = new Cryptocurrency();
    player.playedCards.push(ants, cryptoCurrency);
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.false;
    cryptoCurrency.resourceCount = 1;
    expect(card.canPlay(player)).is.false;
    ants.resourceCount = 1;
    expect(card.canPlay(player)).is.true;
  });

  // Fuller tests would include multiple data cards and multiple microbe cards.
  it('play - simple', () => {
    ants.resourceCount = 1;
    card.play(player);
    runAllActions(game);
    expect(player.plants).eq(3);

    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    expect(ants.resourceCount).eq(0);
    expect(cryptoCurrency.resourceCount).eq(1);
    cast(player.popWaitingFor(), undefined);
  });
});
