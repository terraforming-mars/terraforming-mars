import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {GreatDamAres} from '../../../src/server/cards/ares/GreatDamAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, churnPlay} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GreatDamAres', function() {
  let card: GreatDamAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new GreatDamAres();
    [game, player] = testGame(2, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Requirements + Benefits', function() {
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.not.true;
    maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;
    expect(player.production.energy).to.eq(0);
    card.play(player);
    expect(card.victoryPoints).to.eq(1);
    expect(player.production.energy).to.eq(2);
  });

  it('Requirements', function() {
    maxOutOceans(player, 4);
    const action = cast(churnPlay(card, player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile!.tileType).to.eq(TileType.GREAT_DAM);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.ENERGY, SpaceBonus.ENERGY]});
  });
});
