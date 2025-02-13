import {expect} from 'chai';
import {DesignedOrganisms} from '../../../src/server/cards/pathfinders/DesignedOrganisms';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {runAllActions, testGame} from '../../TestingUtils';

describe('DesignedOrganisms', () => {
  let card: DesignedOrganisms;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DesignedOrganisms();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('canPlay', () => {
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const tardigrades = new Tardigrades();
    const penguins = new Penguins();
    player.playedCards = [tardigrades, penguins];

    card.play(player);
    runAllActions(game);

    expect(player.plants).eq(3);
    expect(player.production.asUnits()).eql(Units.of({plants: 2}));
    expect(tardigrades.resourceCount).eq(3);
    expect(penguins.resourceCount).eq(1);
  });
});
