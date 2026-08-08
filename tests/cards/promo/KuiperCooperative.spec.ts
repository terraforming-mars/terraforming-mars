import {expect} from 'chai';
import {KuiperCooperative} from '@/server/cards/promo/KuiperCooperative';
import {AquiferStandardProject} from '@/server/cards/base/standardProjects/AquiferStandardProject';
import {AsteroidStandardProject} from '@/server/cards/base/standardProjects/AsteroidStandardProject';
import {Tag} from '@/common/cards/Tag';
import {Payment} from '@/common/inputs/Payment';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('KuiperCooperative', () => {
  let card: KuiperCooperative;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new KuiperCooperative();
    [game, player] = testGame(2);
  });

  it('play', () => {
    player.playCorporationCard(card);
    expect(player.megaCredits).to.eq(33);
    expect(player.production.titanium).to.eq(1);
  });

  it('action', () => {
    player.playedCards.push(card);
    player.tagsForTest = {[Tag.SPACE]: 3};

    card.action(player);
    runAllActions(game);

    expect(card.resourceCount).to.eq(3);
  });

  it('Aquifer standard project can be paid with asteroids', () => {
    const aquifer = new AquiferStandardProject();
    expect(aquifer.canPayWith(player)).deep.eq({});

    player.playedCards.push(card);
    card.resourceCount = 5;
    expect(aquifer.canPayWith(player)).deep.eq({kuiperAsteroids: true});

    player.megaCredits = 20;
    player.pay(Payment.of({kuiperAsteroids: 3, megacredits: 15}));

    expect(card.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(5);
  });

  it('Asteroid standard project can be paid with asteroids', () => {
    const asteroid = new AsteroidStandardProject();
    expect(asteroid.canPayWith(player)).deep.eq({});

    player.playedCards.push(card);
    card.resourceCount = 5;
    expect(asteroid.canPayWith(player)).deep.eq({kuiperAsteroids: true});

    player.megaCredits = 20;
    player.pay(Payment.of({kuiperAsteroids: 3, megacredits: 11}));

    expect(card.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(9);
  });
});
