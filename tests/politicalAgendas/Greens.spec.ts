import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../../src/turmoil/TurmoilPolicy';
import {IParty} from '../../src/turmoil/parties/IParty';
import {ISpace} from '../../src/boards/ISpace';
import {resetBoard, setCustomGameOptions, TestPlayers} from '../TestingUtils';
import {Greens, GreensBonus01, GreensBonus02, GreensPolicy04} from '../../src/turmoil/parties/Greens';
import {Lichen} from '../../src/cards/base/Lichen';
import {Fish} from '../../src/cards/base/Fish';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {TileType} from '../../src/TileType';
import {Phase} from '../../src/Phase';
import {SpaceType} from '../../src/SpaceType';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('Greens', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let greens: Greens;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    greens = new Greens();

    resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 MC for each Plant, Microbe and Animal tag you have', function() {
    player.playedCards.push(new Tardigrades(), new Lichen(), new Fish());

    const bonus = new GreensBonus01();
    bonus.grant(game);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 2 MC for each greenery tile you have', function() {
    game.board.spaces[0].player = player;
    game.board.spaces[0].tile = {tileType: TileType.GREENERY};
    game.board.spaces[1].player = player;
    game.board.spaces[1].tile = {tileType: TileType.GREENERY};

    const bonus = new GreensBonus02();
    bonus.grant(game);
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling policy 1: When you place a greenery tile, gain 4 MC', function() {
    setRulingPartyAndRulingPolicy(turmoil, greens, greens.policies[0].id);

    game.addGreenery(player, '10');
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling policy 2: When you place a tile, gain 1 plant', function() {
    setRulingPartyAndRulingPolicy(turmoil, greens, greens.policies[1].id);

    const emptySpace: ISpace = game.board.spaces.find((space) => space.spaceType === SpaceType.LAND && space.bonus.length === 0) as ISpace;
    game.addTile(player, emptySpace.spaceType, emptySpace, {tileType: TileType.NATURAL_PRESERVE});
    expect(player.plants).to.eq(1);
  });

  it('Ruling policy 3: When you play an animal, plant or microbe tag, gain 2 MC', function() {
    setRulingPartyAndRulingPolicy(turmoil, greens, greens.policies[2].id);

    const lichen = new Lichen();
    player.playCard(game, lichen);
    expect(player.megaCredits).to.eq(2);
  });

  it('Ruling policy 4: Spend 5 MC to gain 3 plants or add 2 microbes to any card', function() {
    setRulingPartyAndRulingPolicy(turmoil, greens, greens.policies[3].id);

    const greensPolicy = new GreensPolicy04();
    player.megaCredits = 10;

    // Gain plants
    greensPolicy.action(player, game);
    game.deferredActions.runNext();
    expect(player.plants).to.eq(3);
    expect(player.megaCredits).to.eq(5);

    // Add microbes
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    greensPolicy.action(player, game);
    game.deferredActions.runNext();
    const orOptions = game.deferredActions.next()!.execute() as OrOptions;

    orOptions.options[0].cb();
    expect(tardigrades.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  function setRulingPartyAndRulingPolicy(turmoil: Turmoil, party: IParty, policyId: TurmoilPolicy) {
    turmoil.rulingParty = party;
    turmoil.politicalAgendasData.currentAgenda = {bonusId: party.bonuses[0].id, policyId: policyId};
    game.phase = Phase.ACTION;
  }
});
