const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const Role = require('../../DB/model/role.model');

// Seed initial roles if they don't exist
const seedInitialRoles = async () => {
  const count = await Role.countDocuments();
  if (count === 0) {
    await Role.insertMany([
      {
        name: "Super Admin",
        code: "SUPER_ADMIN",
        description: "Unrestricted global control over platform, roles, permissions, users, and system analytics.",
        isSystem: true,
        permissions: {
          dashboard: "Full platform data",
          users: "Create, edit, delete, activate/deactivate",
          roles: "Full control",
          quizzes: "Full control",
          questions: "Full control",
          categories: "Full control",
          attempts: "View all",
          results: "View all",
          reports: "All reports",
        },
      },
      {
        name: "Admin",
        code: "ADMIN",
        description: "Operational management of quizzes, questions, categories, user status, and quiz reports.",
        isSystem: true,
        permissions: {
          dashboard: "Assigned/operational data",
          users: "View/manage users",
          roles: "None",
          quizzes: "Create/Edit/Manage",
          questions: "Create/Edit/Manage",
          categories: "Manage",
          attempts: "View",
          results: "View",
          reports: "Quiz/user reports",
        },
      },
      {
        name: "User",
        code: "USER",
        description: "Standard end-user access to attempt available quizzes and view personal results.",
        isSystem: true,
        permissions: {
          dashboard: "Personal dashboard",
          users: "None",
          roles: "None",
          quizzes: "Take quizzes",
          questions: "None",
          categories: "Browse",
          attempts: "Own attempts",
          results: "Own results",
          reports: "Personal progress",
        },
      }
    ]);
  }
};

const getRoles = asyncHandler(async (req, res) => {
  await seedInitialRoles();
  const roles = await Role.find().sort({ createdAt: 1 });
  res.send(new ApiResponse(200, 'Roles retrieved successfully', roles));
});

const createRole = asyncHandler(async (req, res) => {
  const { name, code, description, permissions } = req.body;
  const existing = await Role.findOne({ code: code.toUpperCase() });
  if (existing) {
    return res.status(400).send(new ApiResponse(400, 'Role code already exists'));
  }

  const role = await Role.create({
    name,
    code: code.toUpperCase(),
    description,
    permissions,
    isSystem: false,
  });

  res.status(201).send(new ApiResponse(201, 'Role created successfully', role));
});

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, description, permissions } = req.body;

  const role = await Role.findById(id);
  if (!role) {
    return res.status(404).send(new ApiResponse(404, 'Role not found'));
  }

  if (role.isSystem) {
    return res.status(400).send(new ApiResponse(400, 'System roles cannot be modified'));
  }

  const updatedRole = await Role.findByIdAndUpdate(
    id,
    { name, code: code.toUpperCase(), description, permissions },
    { new: true, runValidators: true }
  );

  res.send(new ApiResponse(200, 'Role updated successfully', updatedRole));
});

const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = await Role.findById(id);

  if (!role) {
    return res.status(404).send(new ApiResponse(404, 'Role not found'));
  }

  if (role.isSystem) {
    return res.status(400).send(new ApiResponse(400, 'System roles cannot be deleted'));
  }

  await Role.findByIdAndDelete(id);

  res.send(new ApiResponse(200, 'Role deleted successfully'));
});

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
