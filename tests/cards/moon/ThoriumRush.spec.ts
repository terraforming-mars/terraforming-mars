import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {ThoriumRush} from '../../../src/server/cards/moon/ThoriumRush';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../src/server/turmoil/parties/Reds';

describe('ThoriumRush', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: ThoriumRush;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new ThoriumRush();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    moonData.habitatRate = 0;
    moonData.logisticRate = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpaceOrThrow('m02')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpaceOrThrow('m03')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpaceOrThrow('m04')),

    expect(moonData.habitatRate).eq(1);
    expect(moonData.habitatRate).eq(1);
    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(17);
  });

  it('canPlay when Reds are in power', () => {
    const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
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
    expect(player.canPlay(card)).deep.eq({redsCost: 9});

    moonData.miningRate = 8;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).deep.eq({redsCost: 6});

    moonData.habitatRate = 8;

    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).deep.eq({redsCost: 3});

    moonData.logisticRate = 8;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });
});

