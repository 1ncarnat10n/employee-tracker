USE employeetrack_db;

SELECT * FROM department;

SELECT role.id, title, salary, name as department
FROM role
LEFT JOIN department ON department.id = role.department_id;

SELECT employee.id, employee.first_name, employee.last_name, title, name as department, salary, 
CONCAT(bosses.first_name, ' ', bosses.last_name) as manager 
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee AS bosses ON employee.manager_id = bosses.id;