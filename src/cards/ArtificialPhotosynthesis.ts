import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class ArtificialPhotosynthesis implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ARTIFICIAL_PHOTOSYNTHESIS;

    public play(player: Player) {
      return new OrOptions(
          new SelectOption('Increase your energy production 2 steps', () => {
            player.setProduction(Resources.ENERGY,2);
            return undefined;
          }),
          new SelectOption('Increase your plant production 1 step', () => {
            player.setProduction(Resources.PLANTS);
            return undefined;
          })
      );
    }
}
