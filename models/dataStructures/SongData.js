'use strict';

class SongData {
    constructor({SongId = null, AlbumId = null, Name = null, Price = null, Quantity = null, TrialVerFile = null, FullVerFile = null, AddDate = null, ModifyDate = null, Flag = null}) {
        this.SongId = SongId;
        this.AlbumId = AlbumId;
        this.Name = Name;
        this.Price = Price;
        this.Quantity = Quantity;
        this.TrialVerFile = TrialVerFile;
        this.FullVerFile = FullVerFile;
        this.AddDate = AddDate;
        this.ModifyDate = ModifyDate;
        this.Flag = Flag;
    }
}

module.exports.SongDataConst = {
    SongId: 'SongId',
    AlbumId: 'AlbumId',
    ProductId: 'ProductId',
    Name: 'Name',
    Price: 'Price',
    Quantity: 'Quantity',
    TrialVerFile: 'TrialVerFile',
    FullVerFile: 'FullVerFile',
    AddDate: 'AddDate',
    ModifyDate: 'ModifyDate',
    Flag: 'Flag',
    SQLSelectAll: (tableAlias) => `${tableAlias + '.'}SongId, ${tableAlias + '.'}AlbumId, ${tableAlias + '.'}ProductId, ${tableAlias + '.'}Name, ${tableAlias + '.'}Price, ${tableAlias + '.'}Quantity, ${tableAlias + '.'}TrialVerFile, ${tableAlias + '.'}FullVerFile`,
    tableName: 'songs'
};

module.exports.SongData = SongData;
