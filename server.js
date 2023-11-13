// Modules being used
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable } = require("console-table-printer");
require("dotenv").config();

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect(() => {
    mainMenu();
});

// Function for the main menu and selections
function mainMenu() {
  inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "selection",
      choices: [
        "View All Departments", 
        "View All Roles", 
        "View All Employees", 
        "Add A Department", 
        "Add A Role", 
        "Add An Employee", 
        "Update An Employee Role"
      ]
  })
  .then(answer => {
      if (answer.selection === "View All Departments") {
          viewDepartments();
      } else if (answer.selection === "View All Roles") {
          viewRoles();
      } else if (answer.selection === "View All Employees") {
          viewEmployees();
      } else if (answer.selection === "Add A Department") {
          addDepartment();
      } else if (answer.selection === "Add A Role") {
          addRole();
      } else if (answer.selection === "Add An Employee") {
          addEmployee();
      } else if (answer.selection === "Update An Employee Role") {
          updateEmployeeRole();
      }
  });
}

// Function to view departments
function viewDepartments() {
  const query = "SELECT id, name as department FROM department;";

  db.query(query, (err, data) => {
      if (err) {
          console.error("Error fetching departments:", err);
      } else {
          printTable(data);
      }
      mainMenu();
  });
}

// Function to view roles
function viewRoles() {
  const query = `
      SELECT role.id, title, salary, name as department
      FROM role
      LEFT JOIN department ON department.id = role.department_id;`;

  db.query(query, (err, data) => {
      if (err) {
          console.error("Error fetching roles:", err);
      } else {
          printTable(data);
      }
      mainMenu();
  });
}

// Function to view employees
function viewEmployees() {
  const query = `
      SELECT employee.id, employee.first_name, employee.last_name, title, name as department, salary, 
      CONCAT(bosses.first_name, ' ', bosses.last_name) as manager 
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON department.id = role.department_id
      LEFT JOIN employee AS bosses ON employee.manager_id = bosses.id;`;

  db.query(query, (err, data) => {
      if (err) {
          console.error("Error fetching employees:", err);
      } else {
          printTable(data);
      }
      mainMenu();
  });
}

// Function to view departments
function addDepartment() {
  inquirer.prompt([
      {
          type: "input",
          message: "Enter the name of the new department:",
          name: "department_name",
      },
  ]).then(answer => {
      db.query("INSERT INTO department (name) VALUES (?)", [answer.department_name], err => {
          if (err) {
              console.error("Error adding department:", err);
          } else {
              console.log("Department added successfully.");
          }
          mainMenu();
      });
  });
}

// Function to add a new role
function addRole() {
  db.query("SELECT id as value, name as name FROM department", (err, departmentData) => {
      if (err) {
          console.error("Error fetching department data:", err);
          mainMenu();
          return;
      }

      inquirer.prompt([
          {
              type: "input",
              message: "Enter the title of the new role:",
              name: "title",
          },
          {
              type: "input",
              message: "Enter the salary for the new role:",
              name: "salary",
          },
          {
              type: "list",
              message: "Choose the department for the new role:",
              name: "department_id",
              choices: departmentData,
          },
      ]).then(answer => {
          db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
              [answer.title, answer.salary, answer.department_id], err => {
                  if (err) {
                      console.error("Error adding role:", err);
                  } else {
                      console.log("Role added successfully.");
                  }
                  mainMenu();
              });
      });
  });
}

// Function to add an employee
function addEmployee() {
  db.query("SELECT id as value, title as name from role ", (err, roleData) => {
      db.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee WHERE manager_id is null", (err, ManagerData) => {
          inquirer.prompt([
              {
                  type: "input",
                  message: "What is the first name?",
                  name: "first_name",
              },
              {
                  type: "input",
                  message: "What is the last name?",
                  name: "last_name",
              },
              {
                  type: "list",
                  message: "Choose the following role:",
                  name: "role_id",
                  choices: roleData
              },
              {
                  type: "list",
                  message: "Choose the following manager:",
                  name: "manager_id",
                  choices: ManagerData
              },
          ]).then(answer => {
              db.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)", [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], err => {
                  if (err) {
                      console.error("Error adding employee:", err);
                  } else {
                      console.log("Employee added successfully.");
                      viewEmployees();  // Call viewEmployees after adding an employee
                  }
                  mainMenu();
              });
          });
      });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  db.query("SELECT id as value, title as name from role ", (err, roleData) => {
      db.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee WHERE manager_id is null", (err, employeeData) => {
          inquirer.prompt([
              {
                  type: "list",
                  message: "Choose the following title:",
                  name: "role_id",
                  choices: roleData
              },
              {
                  type: "list",
                  message: "Choose the following employee:",
                  name: "employee_id",
                  choices: employeeData
              },
          ]).then(answer => {
              db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.role_id, answer.employee_id], err => {
                  if (err) {
                      console.error("Error adding employee:", err);
                  } else {
                      console.log("Employee added successfully.");
                      viewEmployees();  // Call viewEmployees after adding an employee
                  }
                  mainMenu();
              });
          });
      });
  });
}