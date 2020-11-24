import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {Tags} from '../../Tags';
import {Game} from '../../../Game';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {ResourceType} from '../../../ResourceType';
import {MAX_COLONY_TRACK_POSITION} from '../../../constants';
import {ColonyName} from '../../../colonies/ColonyName';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectColony} from '../../../inputs/SelectColony';
import {SelectOption} from '../../../inputs/SelectOption';
import {ColonyModel} from '../../../models/ColonyModel';
import {DeferredAction} from '../../../deferredActions/DeferredAction';

export class ColonialOne implements CorporationCard {
    public name: CardName = CardName.COLONIAL_ONE;
    public tags: Array<Tags> = [Tags.SPACE];
    public startingMegaCredits: number = 35;
    public resourceType: ResourceType = ResourceType.FIGHTER;
    public cardType: CardType = CardType.CORPORATION;
    public resourceCount: number = 0;

    public play(player: Player) {
      player.increaseFleetSize();
      this.resourceCount = 3;
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player, game: Game) {
      if (game.colonyDealer === undefined) return undefined;

      const opts: Array<SelectOption> = [];
      const activeColonies = game.colonies.filter((colony) => colony.isActive);
      const openColonies = activeColonies.filter((colony) => colony.visitor === undefined);

      const moveColonyTrack = new SelectOption('Increase or decrease a colony tile track', 'Select colony', () => {
        const coloniesModel: Array<ColonyModel> = game.getColoniesModel(activeColonies);

        game.defer(new DeferredAction(
          player,
          () => new SelectColony('Select colony tile to increase or decrease track', 'Select', coloniesModel, (colonyName: ColonyName) => {
            activeColonies.forEach((colony) => {
              if (colony.name === colonyName) {
                game.defer(new DeferredAction(player, () => new OrOptions(
                  new SelectOption('Increase track for ' + colony.name, 'Increase', () => {
                    if (colony.trackPosition < MAX_COLONY_TRACK_POSITION) {
                      colony.increaseTrack();
                      game.log('${0} increased ${1} colony track 1 step', (b) => b.player(player).colony(colony));
                    }

                    return undefined;
                  }),
                  new SelectOption('Decrease track for ' + colony.name, 'Decrease', () => {
                    if (colony.trackPosition > 0) {
                      colony.decreaseTrack();
                      game.log('${0} decreased ${1} colony track 1 step', (b) => b.player(player).colony(colony));
                    }

                    return undefined;
                  }),
                )));
              }

              return undefined;
            });

            return undefined;
          }),
        ));

        return undefined;
      });

      const spendResource = new SelectOption('Spend 1 fighter resource on this card to trade for free', 'Spend resource', () => {
        const coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);

        game.defer(new DeferredAction(
          player,
          () => new SelectColony('Select colony to trade with for free', 'Select', coloniesModel, (colonyName: ColonyName) => {
            openColonies.forEach((colony) => {
              if (colony.name === colonyName) {
                this.resourceCount--;
                game.log('${0} traded with ${1}', (b) => b.player(player).colony(colony));
                colony.trade(player, game);
                return undefined;
              }

              return undefined;
            });

            return undefined;
          }),
        ));

        return undefined;
      });

      if (openColonies.length > 0 && player.getFleetSize() > player.tradesThisTurn && this.resourceCount > 0) {
        opts.push(spendResource);
      }

      opts.push(moveColonyTrack);

      return new OrOptions(...opts);
    }
}
