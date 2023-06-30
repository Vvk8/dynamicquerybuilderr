-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 01, 2023 at 01:11 AM
-- Server version: 8.0.33-0ubuntu0.20.04.2
-- PHP Version: 7.4.3-4ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backendtask1`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `emp_id` int NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `email` varchar(25) NOT NULL,
  `phonenumber` varchar(10) NOT NULL,
  `designation` varchar(25) NOT NULL,
  `location` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`emp_id`, `user_name`, `email`, `phonenumber`, `designation`, `location`) VALUES
(1001, 'John Doe', 'JohnDoe@gmail.com', '9874563210', 'Developer', 'cbe'),
(1002, 'Jane Smith', 'Jane Smith@gmail.com', '9874563111', 'Backend Developer', 'Blr'),
(1005, 'Alex Johnson', 'Alex Johnson@gmail.com', '987450300', 'Java Developer', 'Cbe'),
(1008, 'Emily Brown', 'Emily Brown@gmail.com', '9875846971', 'Web Developer', 'Cbe'),
(1010, 'vivek', 'vivek@gmail.com', '9874563110', 'admin', 'cbe'),
(1088, 'Ajith', 'Ajith12@example.com', '7796541230', 'Digital Marketing', 'Chennai'),
(1119, 'Anand', 'Anand@example.com', '7796541230', 'Marketing', 'San Andres'),
(1234, 'JohnDoe', 'johndoe@example.com', '1234567890', 'Software Engineer', 'New York'),
(1671, 'Vijay', 'Akashaj@example.com', '9856321470', 'Marketing', 'China'),
(3333, 'Vijay Joseph', 'Vj@example.com', '9856321470', 'Android Developer', 'Salem'),
(5678, 'JaneSmith', 'janesmith@example.com', '9876543210', 'Marketing Manager', 'San Francisco'),
(8888, 'Anand', 'Anand@example.com', '7796541230', 'Marketing', 'San Andres'),
(8889, 'Andrew ', 'Andrew@example.com', '9854763210', 'Android Developer', 'Erode');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`emp_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
