import {expect} from 'chai';
import {addCity, cast} from '../../TestingUtils';
import {MartianRails} from '../../../src/server/cards/base/MartianRails';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MartianRails', () => {
  let card: MartianRails;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianRails();
    [/* game */, player] = testGame(2);
  });

  it('Can not act without energy', () => {
    cast(card.play(player), undefined);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    addCity(player);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ignores cities off Mars', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    addCity(player, SpaceName.GANYMEDE_COLONY);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });
});
