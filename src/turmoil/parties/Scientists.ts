import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';

export class Scientists extends Party implements IParty {
  name = PartyName.SCIENTISTS;
  description: string = 'Tech is the door to the future, and Scientists will do anything to open it.';
  bonuses = [ new ScientistsBonus01(), new ScientistsBonus02()];
}

export class ScientistsBonus01 implements Bonus {
  id = 'sb01';
  isDefault = true;
  description: string = 'Gain 1 MC for each Science tag you have.';

  grant(game: Game) {
    game.getPlayers().forEach(player => {
      let tagCount = player.getTagCount(Tags.SCIENCE, false, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class ScientistsBonus02 implements Bonus {
  id = 'sb02';
  description: string = 'Gain 1 MC for every 2 cards in hand.';
  
  grant(game: Game) {
    game.getPlayers().forEach(player => {
      const amount = Math.floor(player.cardsInHand.length / 2);
      player.setResource(Resources.MEGACREDITS, amount);
    });
  }
}