"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
;
var Company = /** @class */ (function () {
    function Company(data) {
        this.id = data.id;
        this.ticker = data.ticker;
        this.name = data.name;
        this.sector = data.sector;
        this.industry = data.industry;
        this.ipo_year = data.ipo_year;
    }
    return Company;
}());
exports.Company = Company;
