import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {ThoriumRush} from '../../../src/cards/moon/ThoriumRush';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/turmoil/parties/Greens';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../src/turmoil/parties/Reds';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('ThoriumRush', () => {
  let player: Player;
  let game: Game;
  let card: ThoriumRush;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ThoriumRush();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    moonData.colonyRate = 0;
    moonData.logisticRate = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m02')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m03')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m04')),

    expect(moonData.colonyRate).eq(1);
    expect(moonData.colonyRate).eq(1);
    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(17);
  });

  it('canPlay when Reds are in power.', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, MOON_OPTIONS);
    const turmoil = game.turmoil!;
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    player.titanium = 1;
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).is.true;

    moonData.miningRate = 8;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    moonData.colonyRate = 8;

    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    moonData.logisticRate = 8;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });
});

