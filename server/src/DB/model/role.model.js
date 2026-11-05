const mongoose = require('mongoose');
const roleSchema = require('../schema/role.schema');

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
