
-- Create the database
CREATE DATABASE MyTodoApp;

-- Use the newly created database
USE MyTodoApp;

-- Create the Users table
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Create the Tasks table
CREATE TABLE Tasks (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DueDate DATE,
    Completed BOOLEAN DEFAULT FALSE,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);
