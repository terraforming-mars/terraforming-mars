import { Database } from "./database/Database";

export interface playersBreakdown {
    players: number;
    count: number;
}

//interface corporationsBreakdown {
//    corporationName: String;
//    count: number;
//}


export class Statistics {

    //private totalGames: number = 0;
    public playersBreakdown: Array<playersBreakdown> = [];
    //private corporationsBreakdown: Array<corporationsBreakdown> = [];

    public updateStats() : void {
        this.updatePlayersBreakdown();
    }

    private updatePlayersBreakdown() : void {
        let playersBreakdown: Array<playersBreakdown> = [];
        Database.getInstance().getPlayersBreakdown(function (err, pb) {
            if (err || pb === undefined) {
                return;
            }
            pb.forEach((pb)=> {
                playersBreakdown.push(pb);
            });
            return;
        });
        this.playersBreakdown = playersBreakdown;
    }

    //private updateCorporationsBreakdown() : void {

    //}
}    