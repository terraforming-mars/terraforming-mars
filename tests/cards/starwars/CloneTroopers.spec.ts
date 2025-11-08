import {expect} from 'chai';
import {CloneTroopers} from '../../../src/server/cards/starwars/CloneTroopers';
import {testGame} from '../../TestGame';
import {addOcean, cast, formatMessage} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Units} from '../../../src/common/Units';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';

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

    orOptions = cast(card.action(player), OrOptions);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    cast(orOptions.options[1], SelectResource).cb('titanium');
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

  it('respects proteceted resources', () => {
    const card = new CloneTroopers();
    const [/* game */, player, player2, player3] = testGame(3, {starWarsExpansion: true});


    card.resourceCount = 1;

    player.plants = 1;
    player2.plants = 2;
    player3.plants = 3;

    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options.map((o) => formatMessage(o.title))).deep.eq([
      'Add a Clone Trooper to this card',
      'Steal 1 plants from red',
      'Steal 1 plants from yellow',
    ]);

    player2.playedCards.push(new ProtectedHabitats());

    const orOptions2 = cast(card.action(player), OrOptions);
    expect(orOptions2.options.map((o) => formatMessage(o.title))).deep.eq([
      'Add a Clone Trooper to this card',
      'Steal 1 plants from yellow',
    ]);
  });
});
