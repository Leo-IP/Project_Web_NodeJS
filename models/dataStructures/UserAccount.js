'use strict';

class UserAccount {
    constructor({MemberId = null, Email = null, FirstName = null, LastName = null, Birthday = null, Phone = null, Credits = null, LPoints = null, AddDate = null, ModifyDate = null, Flag = null}) {
        this.MemberId = MemberId;
        this.Email = Email;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Birthday = Birthday;
        this.Phone = Phone;
        this.Credits = Credits;
        this.LPoints = LPoints;
        this.AddDate = AddDate;
        this.ModifyDate = ModifyDate;
        this.Flag = Flag;
    }
}

module.exports.UserAccountConst = {
    MemberId: 'MemberId',
    Email: 'Email',
    Password: 'Password',
    FirstName: 'FirstName',
    LastName: 'LastName',
    Birthday: 'Birthday',
    Phone: 'Phone',
    Credits: 'Credits',
    LPoints: 'LPoints',
    AddDate: 'AddDate',
    ModifyDate: 'ModifyDate',
    Flag: 'Flag',
    SQLSelectAll: 'MemberId, Email, FirstName, LastName, Birthday, Phone, Credits, LPoints, AddDate, ModifyDate, Flag',
    SQLInsertAll: 'Email, Password, FirstName, LastName, Birthday, Phone, Credits, LPoints, AddDate, ModifyDate, Flag',
    tableName: 'musicstoredb.members'
};

module.exports.UserAccount = UserAccount;