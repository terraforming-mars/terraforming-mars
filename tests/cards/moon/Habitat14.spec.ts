import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {Habitat14} from '../../../src/cards/moon/Habitat14';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('Habitat14', () => {
  let player: Player;
  let card: Habitat14;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new Habitat14();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    setPlayerProductionForTest(player, {megacredits: -4, energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {megacredits: -5, energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {megacredits: -4, energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {megacredits: -4, energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    setPlayerProductionForTest(player, {megacredits: 1, energy: 1});
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    expect(player.game.deferredActions.next()).instanceOf(PlaceMoonColonyTile);
  });
});

