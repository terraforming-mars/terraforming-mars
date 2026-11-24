import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Virus} from '../../../src/server/cards/base/Virus';
import {MonsInsurance} from '@/server/cards/promo/MonsInsurance';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {formatMessage} from '../../TestingUtils';

describe('Virus', () => {
  let card: Virus;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new Virus();
    [/* game */, player, player2] = testGame(2);
  });

  it('Should play', () => {
    const birds = new Birds();
    const predators = new Predators();
    player.playedCards.push(birds, predators);
    player.addResourceTo(birds);
    player.addResourceTo(predators);
    player.plants = 5;

    const orOptions = cast(card.play(player2), OrOptions);

    orOptions.options[0].cb([birds]);
    expect(birds.resourceCount).to.eq(0);

    orOptions.options[1].cb();
    expect(player.plants).to.eq(0);
  });

  it('Can play when no other player has resources', () => {
    player.plants = 5;
    cast(card.play(player), undefined);
    expect(player.plants).to.eq(5);
  });

  it('Works in solo mode', () => {
    const [game, player] = testGame(1);
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });

  it('Works in solo mode, compatible with Mons Insurance', () => {
    const [game, player] = testGame(1);
    const monsInsurance = new MonsInsurance();
    monsInsurance.play(player);
    player.playedCards.push(monsInsurance);
    player.megaCredits = 10;

    const orOptions = cast(card.play(player), OrOptions);

    expect(orOptions.options).has.length(2);

    orOptions.options[1].cb();
    expect(player.megaCredits).eq(10);
    expect(game.someoneHasRemovedOtherPlayersPlants).is.false;

    orOptions.options[0].cb();
    expect(player.megaCredits).eq(7);
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });

  it('Can remove own plants', () => {
    player.plants = 5;
    player2.plants = 5;

    const orOptions = cast(card.play(player2), OrOptions);

    expect(orOptions.options).has.length(3);
    expect(formatMessage(orOptions.options[0].title)).eq('Remove 5 plants from blue');
    expect(formatMessage(orOptions.options[1].title)).eq('Remove 5 plants from red');
    expect(formatMessage(orOptions.options[2].title)).eq('Skip removal');

    orOptions.options[1].cb();
    expect(player.plants).eq(5);
    expect(player2.plants).eq(0);
  });
});
