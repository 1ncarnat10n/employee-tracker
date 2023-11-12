const inquirer = require('inquirer');
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query(
    'SELECT role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to view all employees
function viewAllEmployees() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID for the role:',
      },
    ])
    .then((answers) => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.department_id,
        },
        (err) => {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name of the employee:',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name of the employee:',
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'Enter the role ID for the employee:',
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the manager ID for the employee (leave blank if none):',
      },
    ])
    .then((answers) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
          manager_id: answers.manager_id || null,
        },
        (err) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          startApp();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: 'employee_id',
        type: 'input',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        name: 'new_role_id',
        type: 'input',
        message: 'Enter the new role ID for the employee:',
      },
    ])
    .then((answers) => {
      connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [answers.new_role_id, answers.employee_id],
        (err) => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          startApp();
        }
      );
    });
}