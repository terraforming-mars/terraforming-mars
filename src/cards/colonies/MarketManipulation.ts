import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MarketManipulation implements IProjectCard {
    public cost = 1;
    public tags = [Tags.EARTH];
    public name = CardName.MARKET_MANIPULATION;
    public cardType = CardType.EVENT;

    public canPlay(_player: Player, game: Game): boolean {
      const increasableColonies = this.getIncreasableColonies(game);
      const decreasableColonies = this.getDecreasableColonies(game);

      if (increasableColonies.length === 0) return false;
      if (decreasableColonies.length === 0) return false;
      if (increasableColonies.length === 1 && decreasableColonies.length === 1 && increasableColonies[0] === decreasableColonies[0]) {
        return false;
      }

      return true;
    }

    private getIncreasableColonies(game: Game) {
      return game.colonies.filter((colony) => colony.trackPosition < 6 && colony.isActive);
    }

    private getDecreasableColonies(game: Game) {
      return game.colonies.filter((colony) => colony.trackPosition > colony.colonies.length && colony.isActive);
    }

    public play(player: Player, game: Game) {
      const selectColonies = new OrOptions();
      selectColonies.title = 'Select colonies to increase and decrease tile track';

      const increasableColonies = this.getIncreasableColonies(game);
      const decreasableColonies = this.getDecreasableColonies(game);

      increasableColonies.forEach(function(c1) {
        decreasableColonies.forEach(function(c2) {
          if (c1.name !== c2.name) {
            const description = 'Increase ' + c1.name + ' (' + c1.description + ') and decrease ' + c2.name + ' (' + c2.description + ')';
            const colonySelect = new SelectOption(
              description,
              'Select',
              () => {
                c1.increaseTrack();
                c2.decreaseTrack();
                game.log('${0} increased ${1} track and decreased ${2} track', (b) => b.player(player).string(c1.name).string(c2.name));
                return undefined;
              },
            );

            selectColonies.options.push(colonySelect);
          };
        });
      });

      return selectColonies;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C23',
      renderData: CardRenderer.builder((b) => {
        b.text('Increase one colony tile track 1 step. Decrease another colony tile track 1 step.', CardRenderItemSize.SMALL, true);
      }),
    }
}
