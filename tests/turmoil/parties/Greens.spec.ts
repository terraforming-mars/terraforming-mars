import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {Space} from '../../../src/server/boards/Space';
import {cast, setRulingParty, addGreenery} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {GREENS_BONUS_1, GREENS_BONUS_2, GREENS_POLICY_4} from '../../../src/server/turmoil/parties/Greens';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('Greens', function() {
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Ruling bonus 1: Gain 1 M€ for each Plant, Microbe and Animal tag you have', function() {
    player.playedCards.push(new Tardigrades(), new Lichen(), new Fish());

    const bonus = GREENS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 2 M€ for each greenery tile you have', function() {
    game.board.spaces[0].player = player;
    game.board.spaces[0].tile = {tileType: TileType.GREENERY};
    game.board.spaces[1].player = player;
    game.board.spaces[1].tile = {tileType: TileType.GREENERY};

    const bonus = GREENS_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling policy 1: When you place a greenery tile, gain 4 MC', function() {
    setRulingParty(game, PartyName.GREENS, 'gp01');

    addGreenery(player, '10');
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling policy 2: When you place a tile, gain 1 plant', function() {
    setRulingParty(game, PartyName.GREENS, 'gp02');

    const emptySpace: Space = game.board.spaces.find((space) => space.spaceType === SpaceType.LAND && space.bonus.length === 0)!;
    game.addTile(player, emptySpace, {tileType: TileType.NATURAL_PRESERVE});
    expect(player.plants).to.eq(1);
  });

  it('Ruling policy 3: When you play an animal, plant or microbe tag, gain 2 MC', function() {
    setRulingParty(game, PartyName.GREENS, 'gp03');

    const lichen = new Lichen();
    player.playCard(lichen);
    expect(player.megaCredits).to.eq(2);
  });

  it('Ruling policy 4: Spend 5 M€ to gain 3 plants or add 2 microbes to any card', function() {
    setRulingParty(game, PartyName.GREENS, 'gp04');

    const greensPolicy = GREENS_POLICY_4;
    player.megaCredits = 10;

    // Gain plants
    greensPolicy.action(player);
    game.deferredActions.runNext();
    expect(player.plants).to.eq(3);
    expect(player.megaCredits).to.eq(5);

    // Add microbes
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    greensPolicy.action(player);
    game.deferredActions.runNext();
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);

    orOptions.options[0].cb();
    expect(tardigrades.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});
