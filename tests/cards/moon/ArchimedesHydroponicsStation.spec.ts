import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {ArchimedesHydroponicsStation} from '../../../src/cards/moon/ArchimedesHydroponicsStation';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('ArchimedesHydroponicsStation', () => {
  let player: TestPlayer;
  let card: ArchimedesHydroponicsStation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ArchimedesHydroponicsStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.setProductionForTest({energy: 1, megacredits: -4});
    expect(player.getPlayableCards()).does.include(card);

    player.setProductionForTest({energy: 0, megacredits: -4});
    expect(player.getPlayableCards()).does.not.include(card);

    player.setProductionForTest({energy: 1, megacredits: -5});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({energy: 1, megacredits: 1, plants: 0});

    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(2);
  });
});
