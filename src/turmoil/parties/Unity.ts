import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  description: string = 'Wants to see humanity prosper in the whole solar system.';
  bonuses = [new UnityBonus01(), new UnityBonus02()];
}

export class UnityBonus01 implements Bonus {
  id = 'ub01';
  description = 'Gain 1 MC for each Venus tag, Earth tag, and Jovian tag you have.';
  isDefault = true;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tags = [Tags.VENUS, Tags.EARTH, Tags.JOVIAN];
      const tagCount = tags.map((tag) => player.getTagCount(tag, false, false)).reduce((acc, count) => acc + count, 0);

      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class UnityBonus02 implements Bonus {
  id = 'ub02';
  description = 'Gain 1 MC for each space tag you have, including events.';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.SPACE, true, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}
