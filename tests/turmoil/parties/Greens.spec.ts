import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {ISpace} from '../../../src/server/boards/ISpace';
import {cast, testGameOptions, setRulingPartyAndRulingPolicy} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Greens, GREENS_BONUS_1, GREENS_BONUS_2, GREENS_POLICY_4} from '../../../src/server/turmoil/parties/Greens';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('Greens', function() {
  let player: Player;
  let game: Game;
  let turmoil: Turmoil;
  let greens: Greens;

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    const otherPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, otherPlayer], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    greens = new Greens();
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
    setRulingPartyAndRulingPolicy(game, turmoil, greens, greens.policies[0].id);

    game.addGreenery(player, '10');
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling policy 2: When you place a tile, gain 1 plant', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, greens, greens.policies[1].id);

    const emptySpace: ISpace = game.board.spaces.find((space) => space.spaceType === SpaceType.LAND && space.bonus.length === 0) as ISpace;
    game.addTile(player, emptySpace.spaceType, emptySpace, {tileType: TileType.NATURAL_PRESERVE});
    expect(player.plants).to.eq(1);
  });

  it('Ruling policy 3: When you play an animal, plant or microbe tag, gain 2 MC', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, greens, greens.policies[2].id);

    const lichen = new Lichen();
    player.playCard(lichen);
    expect(player.megaCredits).to.eq(2);
  });

  it('Ruling policy 4: Spend 5 M€ to gain 3 plants or add 2 microbes to any card', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, greens, greens.policies[3].id);

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
