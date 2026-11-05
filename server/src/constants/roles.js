const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

const roleRights = new Map();
roleRights.set(ROLES.USER, ['getQuizzes', 'takeQuizzes', 'getOwnResults']);
roleRights.set(ROLES.ADMIN, [
  'getQuizzes',
  'manageQuizzes',
  'manageQuestions',
  'getAllResults',
  'manageUsers',
]);
roleRights.set(ROLES.SUPER_ADMIN, [
  'getQuizzes',
  'manageQuizzes',
  'manageQuestions',
  'getAllResults',
  'manageUsers',
  'manageRoles',
]);

module.exports = {
  ROLES,
  roleRights,
};
