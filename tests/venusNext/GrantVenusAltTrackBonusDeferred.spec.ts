import {expect} from 'chai';
import {Player} from '../../src/server/Player';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {GrantVenusAltTrackBonusDeferred} from '../../src/server/venusNext/GrantVenusAltTrackBonusDeferred';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {cast} from '../TestingUtils';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {Birds} from '../../src/server/cards/base/Birds';

describe('GrantVenusAltTrackBonusDeferred', function() {
  let player: Player;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('grant single bonus', () => {
    const input = cast(new GrantVenusAltTrackBonusDeferred(player, 1, false).execute(), AndOptions);
    input.options[0].cb(0);
    input.options[1].cb(0);
    input.options[2].cb(0);
    input.options[3].cb(0);
    input.options[4].cb(0);
    input.options[5].cb(1);
    input.cb();
    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.plants).eq(0);
    expect(player.energy).eq(0);
    expect(player.heat).eq(1);
  });

  it('reject too many bonuses', () => {
    const input = cast(new GrantVenusAltTrackBonusDeferred(player, 2, false).execute(), AndOptions);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[5].cb(3);

    expect(() => input.cb()).to.throw('Select 2 resources.');

    player.heat = 0;
    input.options[5].cb(2);
    input.cb();
    expect(player.heat).eq(2);
  });

  it('grants wild resource', () => {
    // If the player had a resource card, the deferred action would return OrOption
    cast(new GrantVenusAltTrackBonusDeferred(player, 0, true).execute(), AndOptions);

    const card = new Tardigrades();
    const otherCard = new Birds();
    player.playedCards.push(otherCard, card);

    const input = cast(new GrantVenusAltTrackBonusDeferred(player, 0, true).execute(), OrOptions);
    const selectCard = cast(input.options[0], SelectCard);
    expect(selectCard.cards).has.length(2);
    expect(card.resourceCount).eq(0);
    selectCard.cb([card]);
    expect(card.resourceCount).eq(1);

    // The second option is the standard resource section.
    expect(input.options[1]).instanceof(AndOptions);
  });
});
