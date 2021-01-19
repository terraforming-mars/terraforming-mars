import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Potatoes implements IProjectCard {
    public cost = 2;
    public tags = [Tags.PLANT];
    public name = CardName.POTATOES;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      const viralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
      const hasEnoughPlants = player.plants >= 2 || player.plants >= 1 && viralEnhancers !== undefined;

      return hasEnoughPlants;
    }

    public play(player: Player) {
      player.plants -= 2;
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X29',
      renderData: CardRenderer.builder((b) => {
        b.minus().plants(2).nbsp.production((pb) => pb.megacredits(2));
      }),
      description: 'Lose 2 plants. Increase your MC production 2 steps.',
    }
}
