import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {ArchimedesHydroponicsStation} from '../../../src/cards/moon/ArchimedesHydroponicsStation';
import {expect} from 'chai';
import {Units} from '../../../src/Units';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ArchimedesHydroponicsStation', () => {
  let player: Player;
  let card: ArchimedesHydroponicsStation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ArchimedesHydroponicsStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    setPlayerProductionForTest(player, Units.of({energy: 1, megacredits: -4}));
    expect(player.getPlayableCards()).does.include(card);

    setPlayerProductionForTest(player, Units.of({energy: 0, megacredits: -4}));
    expect(player.getPlayableCards()).does.not.include(card);

    setPlayerProductionForTest(player, Units.of({energy: 1, megacredits: -5}));
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    setPlayerProductionForTest(player, Units.of({energy: 1, megacredits: 1, plants: 0}));

    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(2);
  });
});
