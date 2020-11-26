
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {CardRenderer} from './render/CardRenderer';

export class Cartel implements IProjectCard {
    public cost = 8;
    public tags = [Tags.EARTH];
    public name = CardName.CARTEL;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '137',
      description: 'Increase your MC production 1 step for each Earth tag you have, including this',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
        pb.megacredits(1).slash().earth().played;
      })),
    }
}
