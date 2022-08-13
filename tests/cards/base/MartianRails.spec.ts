import {expect} from 'chai';
import {MartianRails} from '../../../src/server/cards/base/MartianRails';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';

describe('MartianRails', () => {
  let card: MartianRails;
  let player: Player;
  let game: Game;

  beforeEach(() => {
    card = new MartianRails();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act without energy', () => {
    expect(card.play(player)).is.undefined;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ignores cities off Mars', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });
});
