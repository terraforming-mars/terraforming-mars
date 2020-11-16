import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Player} from '../../Player';
import {Policy} from '../Policy';
import {IProjectCard} from '../../cards/IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';

export class Scientists extends Party implements IParty {
  name = PartyName.SCIENTISTS;
  description: string = 'Tech is the door to the future, and Scientists will do anything to open it.';
  bonuses = [new ScientistsBonus01(), new ScientistsBonus02()];
}

export class ScientistsBonus01 implements Bonus {
  id = 'sb01';
  isDefault = true;
  description: string = 'Gain 1 MC for each Science tag you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.SCIENCE, false, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class ScientistsBonus02 implements Bonus {
  id = 'sb02';
  description: string = 'Gain 1 MC for every 2 cards in hand';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const amount = Math.floor(player.cardsInHand.length / 2);
      player.setResource(Resources.MEGACREDITS, amount);
    });
  }
}

export class ScientistsPolicy01 implements Policy {
  isDefault = true;
  id = 'sp01';
  description: string = 'Pay 10 MC to draw 3 cards';

  canAct(player: Player) {
    return player.canAfford(10);
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
        player,
        10,
        false,
        false,
        'Select how to pay for action',
        () => {
          player.cardsInHand.push(
              game.dealer.dealCard(),
              game.dealer.dealCard(),
              game.dealer.dealCard(),
          );
          game.log('${0} drew 3 cards', (b) => b.player(player));
        },
    ));

    return undefined;
  }
}

export class ScientistsPolicy02 implements Policy {
  id = 'sp02';
  description: string = 'Your global requirements are +/- 2 steps';
}

export class ScientistsPolicy03 implements Policy {
  id = 'sp03';
  description: string = 'Pay 4 MC to discard a card and draw a card';

  canAct(player: Player) {
    return player.canAfford(4);
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
        player,
        4,
        false,
        false,
        'Select how to pay for action',
        () => {
          return new SelectCard('Select a card to discard', 'Discard', player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
            game.dealer.discard(foundCards[0]);
            player.cardsInHand.push(game.dealer.dealCard());
            game.log('${0} discarded a card to draw a card', (b) => b.player(player));
            return undefined;
          });
        },
    ));

    return undefined;
  }
}

export class ScientistsPolicy04 implements Policy {
  id = 'sp04';
  description: string = 'Cards with Science tag requirements may be played with 1 less Science tag';
}
