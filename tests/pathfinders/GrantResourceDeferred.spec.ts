import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {GrantResourceDeferred} from '../../src/pathfinders/GrantResourceDeferred';
import {OrOptions} from '../../src/inputs/OrOptions';
import {SelectResources} from '../../src/inputs/SelectResources';
import {SelectCard} from '../../src/inputs/SelectCard';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Ants} from '../../src/cards/base/Ants';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {IProjectCard} from '../../src/cards/IProjectCard';

describe('GrantResourceDeferred', function() {
  let player: TestPlayer;
  let ants: Ants;
  let tardigrades: Tardigrades;

  beforeEach(() => {
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
    ants = new Ants();
    tardigrades = new Tardigrades();
    player.playedCards.push(ants);
    player.playedCards.push(tardigrades);
  });

  it('grant single bonus', () => {
    const input = new GrantResourceDeferred(player, false).execute() as OrOptions;
    expect(input.options).has.length(1);
    expect(input.options[0]).instanceOf(SelectResources);
    const selectOptions = input.options[0] as SelectResources;
    selectOptions.options[0].cb(0);
    selectOptions.options[1].cb(0);
    selectOptions.options[2].cb(0);
    selectOptions.options[3].cb(0);
    selectOptions.options[4].cb(0);
    selectOptions.options[5].cb(1);

    selectOptions.cb();

    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.plants).eq(0);
    expect(player.energy).eq(0);
    expect(player.heat).eq(1);
  });

  it('grant single bonus or wild bonus', () => {
    const input = new GrantResourceDeferred(player, true).execute() as OrOptions;
    expect(input.options).has.length(2);
    expect(input.options[0]).instanceOf(SelectResources);
    expect(input.options[1]).instanceOf(SelectCard);
    const selectCard = input.options[1] as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.members([ants, tardigrades]);
    expect(ants.resourceCount).eq(0);

    selectCard.cb([ants]);

    expect(ants.resourceCount).eq(1);
  });
});
