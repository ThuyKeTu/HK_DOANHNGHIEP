CREATE DATABASE IF NOT EXISTS university;
USE university;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    age INT,
    address VARCHAR(255)
);


INSERT INTO user (first_name, last_name, email, age, address) VALUES
('John', 'Doe', 'john.doe@example.com', 20, '123 Main St, City'),
('Jane', 'Smith', 'jane.smith@example.com', 22, '456 Elm St, Town'),
('Michael', 'Johnson', 'michael.johnson@example.com', 21, '789 Oak St, Village'),
('Emily', 'Brown', 'emily.brown@example.com', 23, '101 Pine St, Hamlet'),
('Daniel', 'Lee', 'daniel.lee@example.com', 19, '202 Maple St, Borough');