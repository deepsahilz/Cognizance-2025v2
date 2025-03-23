const express = require("express");
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignFreelancer,
} = require("../controllers/projectController");
const validators = require("../utils/validators");
const validate = require("../middleware/validate");

const router = express.Router();


// Include milestone router for nested routes
const milestoneRouter = require('./milestone.routes');

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
// Re-route into milestone routes
router.use('/:projectId/milestones', milestoneRouter);

router
  .route("/")
  .get(validate(validators.pagination), getProjects)
  .post(
    auth,
    roleCheck("employer", "admin"),
    validate(validators.createProject),
    createProject
  );

router
  .route("/:id")
  .get(validate(validators.idParam), getProject)
  .put(
    auth,
    validate([...validators.idParam, ...validators.createProject]),
    updateProject
  )
  .delete(auth, validate(validators.idParam), deleteProject);

router
  .route("/:id/assign")
  .put(
    auth,
    roleCheck("employer", "admin"),
    validate([
      ...validators.idParam,
      body("freelancerId").isMongoId().withMessage("Invalid freelancer ID"),
    ]),
    assignFreelancer
  );

module.exports = router;