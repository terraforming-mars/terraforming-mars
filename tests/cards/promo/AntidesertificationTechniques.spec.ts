import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AntidesertificationTechniques} from '../../../src/server/cards/promo/AntidesertificationTechniques';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('AntidesertificationTechniques', function() {
  let card: AntidesertificationTechniques;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AntidesertificationTechniques();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).eq(3);
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1, steel: 1}));
  });
});
