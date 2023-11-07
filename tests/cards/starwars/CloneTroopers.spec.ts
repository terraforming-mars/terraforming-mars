import {expect} from 'chai';
import {CloneTroopers} from '../../../src/server/cards/starwars/CloneTroopers';
import {testGame} from '../../TestGame';
import {addOcean, cast} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Units} from '../../../src/common/Units';
import {SelectOption} from '../../../src/server/inputs/SelectOption';

describe('CloneTroopers', () => {
  it('Can play', () => {
    const card = new CloneTroopers();
    const [/* game */, player] = testGame(2, {starWarsExpansion: true});

    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);

    expect(card.canPlay(player)).is.false;

    addOcean(player);

    expect(card.canPlay(player)).is.true;
  });

  it('act solo', () => {
    const card = new CloneTroopers();
    const [/* game */, player] = testGame(1, {starWarsExpansion: true});

    expect(card.resourceCount).eq(0);

    cast(card.action(player), undefined);

    expect(card.resourceCount).eq(1);

    let orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(card.resourceCount).eq(2);

    expect(orOptions.options[1].cb()).is.undefined;

    orOptions = cast(card.action(player), OrOptions);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    cast(orOptions.options[1], OrOptions).options[2].cb();
    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 1}));
    expect(card.resourceCount).eq(1);
  });

  it('act multiplayer', () => {
    const card = new CloneTroopers();
    const [/* game */, player, player2, player3] = testGame(3, {starWarsExpansion: true});

    expect(card.resourceCount).eq(0);

    cast(card.action(player), undefined);

    expect(card.resourceCount).eq(1);

    cast(card.action(player), undefined);

    expect(card.resourceCount).eq(2);

    player2.megaCredits = 2;
    player3.titanium = 5;

    let orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(card.resourceCount).eq(3);

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);

    orOptions = cast(card.action(player), OrOptions);
    cast(orOptions.options[1], SelectOption).cb(undefined);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player2.stock.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player3.stock.asUnits()).deep.eq(Units.of({titanium: 5}));
    expect(card.resourceCount).eq(2);

    cast(orOptions.options[2], SelectOption).cb(undefined);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1, titanium: 1}));
    expect(player2.stock.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player3.stock.asUnits()).deep.eq(Units.of({titanium: 4}));
    expect(card.resourceCount).eq(1);
  });
});
