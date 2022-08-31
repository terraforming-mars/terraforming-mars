import {expect} from 'chai';
import {DesignedOrganisms} from '../../../src/server/cards/pathfinders/DesignedOrganisms';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {runAllActions} from '../../TestingUtils';

describe('DesignedOrganisms', function() {
  let card: DesignedOrganisms;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DesignedOrganisms();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
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
