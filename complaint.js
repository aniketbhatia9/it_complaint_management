const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Complaint extends Model {}

Complaint.init({
    UserName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    UserDepartment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    UserLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ProblemDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ResolvedOn: {
        type: DataTypes.DATE,
    },
    Remark: {
        type: DataTypes.STRING,
    },
    // This field associates the complaint with the user who submitted it
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Assuming your user model is called Users
            key: 'id',
        },
    },
    // Add this field to store assistant's name
    TaskAssignedTo: {
        type: DataTypes.STRING,  
        allowNull: false, // or true, based on your requirement
    },
}, {
    sequelize,
    modelName: 'Complaint',
});

module.exports = Complaint;
