-- Insert data into the department table
INSERT INTO department (id, name) VALUES
    (1, 'Sales'),
    (2, 'Marketing'),
    (3, 'Engineering');

-- Insert data into the role table
INSERT INTO role (id, title, salary, department_id) VALUES
    (1, 'Sales Manager', 70000, 1),
    (2, 'Sales Representative', 50000, 1),
    (3, 'Marketing Coordinator', 45000, 2),
    (4, 'Software Engineer', 80000, 3),
    (5, 'QA Engineer', 70000, 3);

-- Insert data into the employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Jane', 'Smith', 2, 1),
    (3, 'Bob', 'Johnson', 3, NULL),
    (4, 'Alice', 'Williams', 4, NULL),
    (5, 'Charlie', 'Brown', 5, 4);