INSERT INTO department (department_name)
VALUES
    ('Sales'),
    ('Finance'),
    ('Legal'),
    ('Engineering'),
    ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Representative', 50000.00, 1),
    ('Financial Analyst', 70000.00, 2),
    ('Associate Attorney', 110000.00, 3),
    ('Recruiter', 55000.00 ,4),
    ('Mechanical Engineer', 125000.00, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ('Jae', 'Kim', 1),
    ('James', 'Madison', 1),
    ('Grant', 'Williams', 1),
    ('Tony', 'Pollard', 1),
    ('Bryan','Gil', 1);
    ('Stacey','Hill', 1);
    ('Amanda','Brown', 1);
    ('Tom','Brady', 1);
    ('James','Miller', 1);