import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Coastguard, Irrigator} from '../../src/server/milestones/Irrigator';
import {addCity, addGreenery, maxOutOceans} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Irrigator', () => {
  let milestone: Irrigator;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Irrigator();
    [/* game */, player] = testGame(2);

    maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    addCity(player, '09');
    addGreenery(player, '20');
    addCity(player, '11');
    expect(milestone.canClaim(player)).is.false;

    addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });

  it('Coastguard: MarsBot needs 4 tiles adjacent to oceans where a player needs 3', () => {
    const coastguard = new Coastguard();
    const bot = {player} as unknown as IMarsBot;
    addCity(player, '09');
    addGreenery(player, '20');
    addCity(player, '11');
    expect(coastguard.canClaim(player)).is.true;
    expect(coastguard.marsBotCanClaim(bot)).is.false;

    addGreenery(player, '24');
    expect(coastguard.marsBotCanClaim(bot)).is.true;
  });
});
