
import Vue from "vue";

export const PlayerResources = Vue.component("player-resources", {
    props: ["player"],
    data: function () {
        return {};
    },
    template: `
        <div>
            <table class="nes-table is-bordered is-centered">
                <thead>
                    <tr>
                        <th colspan="2">Mega Credits</th>
                        <th colspan="2">Steel</th>
                        <th colspan="2">Titanium</th>
                    </tr>
                    <tr>
                        <th>Stock</th>
                        <th>Production</th>
                        <th>Stock</th>
                        <th>Production</th>
                        <th>Stock</th>
                        <th>Production</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{player.megaCredits}}</td>
                        <td>{{player.megaCreditProduction}}</td>
                        <td>{{player.steel}}</td>
                        <td>{{player.steelProduction}}</td>
                        <td>{{player.titanium}}</td>
                        <td>{{player.titaniumProduction}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="nes-table is-bordered is-centered">
                <thead>
                    <tr>
                        <th colspan="2">Plants</th>
                        <th colspan="2">Energy</th>
                        <th colspan="2">Heat</th>
                    </tr>
                    <tr>
                        <th>Stock</th>
                        <th>Production</th>
                        <th>Stock</th>
                        <th>Production</th>
                        <th>Stock</th>
                        <th>Production</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{player.plants}}</td>
                        <td>{{player.plantProduction}}</td>
                        <td>{{player.energy}}</td>
                        <td>{{player.energyProduction}}</td>
                        <td>{{player.heat}}</td>
                        <td>{{player.heatProduction}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
});

