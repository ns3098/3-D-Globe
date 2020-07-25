const request = require('request');
const csv = require('csvtojson');

class BioData {
    constructor() {
        this.timeSeriesURL =
            'https://raw.githubusercontent.com/ns3098/python-packages/master';
        this.countryRenameMapper = { // Renaming the country if required
            "United States": 'United States of America',

        };
    }

    async fetchBioData() {
        const roundOffCoord = (coord) => parseFloat(coord.trim()).toFixed(5);

        let countryMapper = {};

        // Load data
        const data = await this.getDataFromServer();
        const headers = Object.keys(data[0]);


        var mapped = {};
        for (var i = 0; i < data.length; i++) {
            let item = data[i]["Country"];
            let classification = data[i]["Classification"];
            let company = data[i]['Company Name'];
            if (item in (this.countryRenameMapper)) {
                item = this.countryRenameMapper[item];
            }
            if (item != "") {
                if (!(item in mapped)) {
                    mapped[item] = {};
                    mapped[item]['Total Company'] = 1;
                    mapped[item][classification] = [];
                    mapped[item][classification].push(company);

                } else {

                    if (!(classification in mapped[item])) {
                        mapped[item][classification] = [];
                        mapped[item][classification].push(company);
                    } else {
                        mapped[item][classification].push(company);
                    }

                    mapped[item]['Total Company'] += 1;
                }
            }

        }

        return mapped;
    }


    parseCSV(url) {
        return new Promise((resolve, reject) => {
            const rows = [];
            csv()
                .fromStream(request.get(url))
                .subscribe(
                    (json) => {
                        rows.push(json);
                    },
                    () => {
                        reject();
                    },
                    () => {
                        resolve(rows);
                    }
                );
        });
    }

    getDataFromServer() {
        return this.parseCSV(
            `${this.timeSeriesURL}/bio.csv`
        );
    }


}

module.exports = new BioData();
