import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class FreyjaBiodomes implements IProjectCard {
    public cost = 14;
    public tags = [Tags.PLANT, Tags.VENUS];
    public name = CardName.FREYJA_BIODOMES;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 && game.checkMinRequirements(player, GlobalParameter.VENUS, 10);
    }
    public getResCards(player: Player): ICard[] {
      let resourceCards = player.getResourceCards(ResourceType.ANIMAL);
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
      return resourceCards.filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
    }

    public play(player: Player) {
      const cards = this.getResCards(player);

      if (cards.length > 1) {
        return new SelectCard(
          'Select card to add 2 resources',
          'Add resources',
          cards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], 2);
            player.addProduction(Resources.ENERGY, -1);
            player.addProduction(Resources.MEGACREDITS, 2);
            LogHelper.logAddResource(player, foundCards[0], 2);
            return undefined;
          },
        );
      }

      if (cards.length === 1) {
        player.addResourceTo(cards[0], 2);
        LogHelper.logAddResource(player, cards[0], 2);
      }

      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '227',
      requirements: CardRequirements.builder((b) => b.venus(10)),
      renderData: CardRenderer.builder((b) => {
        b.microbes(2).secondaryTag(Tags.VENUS).or().animals(2).secondaryTag(Tags.VENUS).br;
        b.production((pb) => pb.minus().energy(1).nbsp.plus().megacredits(2));
      }),
      description: {
        text: 'Requires 10% on the Venus track. Add 2 Microbes or 2 Animals to another Venus card. Production: energy -1, MC +2.',
        align: 'left',
      },
      victoryPoints: 2,
    }
}
