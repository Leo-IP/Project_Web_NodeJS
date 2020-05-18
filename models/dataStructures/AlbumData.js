'use strict';

class AlbumData {
    constructor({AlbumId = null, Name = null, Description = null, Artist = null, Quantity = null, CoverImageFile = null, PriceOverride = null, AddDate = null, ModifyDate = null, Flag = null}) {
        this.AlbumId = AlbumId;
        this.Name = Name;
        this.Description = Description;
        this.Artist = Artist;
        this.Quantity = Quantity;
        this.CoverImageFile = CoverImageFile;
        this.PriceOverride = PriceOverride;
        this.AddDate = AddDate;
        this.ModifyDate = ModifyDate;
        this.Flag = Flag;
    }
}

module.exports.AlbumDataConst = {
    AlbumId: 'AlbumId',
    ProductId: 'ProductId',
    Name: 'Name',
    Description: 'Description',
    Artist: 'Artist',
    Quantity: 'Quantity',
    CoverImageFile: 'CoverImageFile',
    PriceOverride: 'PriceOverride',
    AddDate: 'AddDate',
    ModifyDate: 'ModifyDate',
    Flag: 'Flag',
    SQLSelectAll: '*',
    tableName: 'albums'
};

module.exports.AlbumData = AlbumData;