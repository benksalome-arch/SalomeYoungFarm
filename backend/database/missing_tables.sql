-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: livestockpro
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chicken_mortality`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `chicken_mortality` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chicken_id` int NOT NULL,
  `mortality_date` date NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `cause` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chicken_id` (`chicken_id`),
  CONSTRAINT `chicken_mortality_ibfk_1` FOREIGN KEY (`chicken_id`) REFERENCES `chickens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chicken_mortality`
--
/*!40000/*!40000--
-- Table structure for table `chicken_vaccinations`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `chicken_vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chicken_id` int NOT NULL,
  `vaccination_date` date NOT NULL,
  `vaccine_name` varchar(150) NOT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `administered_by` varchar(150) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_chicken_vaccinations` (`chicken_id`),
  CONSTRAINT `fk_chicken_vaccinations` FOREIGN KEY (`chicken_id`) REFERENCES `chickens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chicken_vaccinations`
--
/*!40000/*!40000--
-- Table structure for table `chickens`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `chickens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_number` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `breed` varchar(100) NOT NULL,
  `type` enum('Layer','Broiler','Cockerel','Cock','Hen','Chick') NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `hatch_date` date DEFAULT NULL,
  `source` varchar(150) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `status` enum('Active','Sold','Dead') DEFAULT 'Active',
  `purchase_price` decimal(12,2) DEFAULT '0.00',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_number` (`tag_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chickens`
--
/*!40000/*!40000--
-- Table structure for table `egg_production`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `egg_production` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chicken_id` int NOT NULL,
  `production_date` date NOT NULL,
  `eggs_collected` int NOT NULL,
  `cracked_eggs` int DEFAULT '0',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_egg_chicken` (`chicken_id`),
  CONSTRAINT `fk_egg_chicken` FOREIGN KEY (`chicken_id`) REFERENCES `chickens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `egg_production`
--
/*!40000/*!40000--
-- Table structure for table `egg_sales`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `egg_sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sale_date` date NOT NULL,
  `customer` varchar(150) DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_per_egg` decimal(10,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` enum('Cash','M-PESA','Bank') DEFAULT 'Cash',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `egg_sales`
--
/*!40000/*!40000--
-- Table structure for table `feed`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `feed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feed_name` varchar(150) NOT NULL,
  `category` enum('Goat','Chicken','Rabbit','General') NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `unit` varchar(20) NOT NULL DEFAULT 'kg',
  `minimum_stock` decimal(12,2) DEFAULT '0.00',
  `cost_per_unit` decimal(12,2) DEFAULT '0.00',
  `supplier` varchar(150) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed`
--
/*!40000/*!40000--
-- Table structure for table `feed_usage`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `feed_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feed_id` int NOT NULL,
  `animal_type` enum('Goat','Chicken','Rabbit') NOT NULL,
  `animal_id` int DEFAULT NULL,
  `quantity_used` decimal(12,2) NOT NULL,
  `usage_date` date NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_feed_usage_feed` (`feed_id`),
  CONSTRAINT `fk_feed_usage_feed` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_usage`
--
/*!40000/*!40000--
-- Table structure for table `finance`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `finance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_date` date NOT NULL,
  `type` enum('Income','Expense') NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('Cash','M-PESA','Bank') DEFAULT 'Cash',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `finance_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance`
--
/*!40000/*!40000--
-- Table structure for table `goat_breeding`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_breeding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doe_id` int NOT NULL,
  `buck_id` int NOT NULL,
  `mating_date` date NOT NULL,
  `expected_kidding` date NOT NULL,
  `pregnancy_status` enum('Open','Pregnant','Confirmed','Aborted','Kidded') DEFAULT 'Pregnant',
  `pregnancy_days` int DEFAULT '0',
  `veterinarian` varchar(100) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doe_id` (`doe_id`),
  KEY `buck_id` (`buck_id`),
  CONSTRAINT `goat_breeding_ibfk_1` FOREIGN KEY (`doe_id`) REFERENCES `goats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `goat_breeding_ibfk_2` FOREIGN KEY (`buck_id`) REFERENCES `goats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_breeding`
--
/*!40000/*!40000--
-- Table structure for table `goat_health`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_health` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goat_id` int NOT NULL,
  `record_date` date NOT NULL,
  `record_type` varchar(50) NOT NULL,
  `medicine` varchar(100) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `veterinarian` varchar(100) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_goat_health` (`goat_id`),
  CONSTRAINT `fk_goat_health` FOREIGN KEY (`goat_id`) REFERENCES `goats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_health`
--
/*!40000/*!40000--
-- Table structure for table `goat_kidding`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_kidding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `breeding_id` int NOT NULL,
  `kidding_date` date NOT NULL,
  `male_kids` int DEFAULT '0',
  `female_kids` int DEFAULT '0',
  `stillborn` int DEFAULT '0',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `breeding_id` (`breeding_id`),
  CONSTRAINT `goat_kidding_ibfk_1` FOREIGN KEY (`breeding_id`) REFERENCES `goat_breeding` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_kidding`
--
/*!40000/*!40000--
-- Table structure for table `goat_kids`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_kids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kidding_id` int NOT NULL,
  `goat_id` int DEFAULT NULL,
  `tag` varchar(50) DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `birth_weight` decimal(5,2) DEFAULT NULL,
  `colour` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Healthy',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kidding_id` (`kidding_id`),
  CONSTRAINT `goat_kids_ibfk_1` FOREIGN KEY (`kidding_id`) REFERENCES `goat_kidding` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_kids`
--
/*!40000/*!40000--
-- Table structure for table `goat_photos`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goat_id` int NOT NULL,
  `photo` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `goat_id` (`goat_id`),
  CONSTRAINT `goat_photos_ibfk_1` FOREIGN KEY (`goat_id`) REFERENCES `goats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_photos`
--
/*!40000/*!40000--
-- Table structure for table `goat_weights`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `goat_weights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goat_id` int NOT NULL,
  `weight` decimal(6,2) NOT NULL,
  `record_date` date NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_goat_weights` (`goat_id`),
  CONSTRAINT `fk_goat_weights` FOREIGN KEY (`goat_id`) REFERENCES `goats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goat_weights`
--
/*!40000/*!40000--
-- Table structure for table `goats`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goats`
--

/*!40000 /*!40000 --
-- Table structure for table `inventory`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `quantity` decimal(10,2) DEFAULT '0.00',
  `unit` varchar(30) NOT NULL,
  `minimum_stock` decimal(10,2) DEFAULT '0.00',
  `purchase_price` decimal(12,2) DEFAULT '0.00',
  `supplier` varchar(150) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_breeding`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_breeding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rabbit_id` int NOT NULL,
  `breeding_date` date NOT NULL,
  `male_rabbit_id` int DEFAULT NULL,
  `breeding_type` varchar(100) DEFAULT NULL,
  `expected_birth_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Planned',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rabbit_id` (`rabbit_id`),
  KEY `male_rabbit_id` (`male_rabbit_id`),
  CONSTRAINT `rabbit_breeding_ibfk_1` FOREIGN KEY (`rabbit_id`) REFERENCES `rabbits` (`id`),
  CONSTRAINT `rabbit_breeding_ibfk_2` FOREIGN KEY (`male_rabbit_id`) REFERENCES `rabbits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_breeding`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_health`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_health` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rabbit_id` int NOT NULL,
  `treatment_date` date NOT NULL,
  `treatment_type` varchar(100) NOT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `medication` varchar(255) DEFAULT NULL,
  `veterinarian` varchar(255) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT '0.00',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rabbit_id` (`rabbit_id`),
  CONSTRAINT `rabbit_health_ibfk_1` FOREIGN KEY (`rabbit_id`) REFERENCES `rabbits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_health`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_litters`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_litters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `breeding_id` int NOT NULL,
  `birth_date` date NOT NULL,
  `total_kits` int NOT NULL DEFAULT '0',
  `live_kits` int NOT NULL DEFAULT '0',
  `dead_kits` int NOT NULL DEFAULT '0',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `breeding_id` (`breeding_id`),
  CONSTRAINT `rabbit_litters_ibfk_1` FOREIGN KEY (`breeding_id`) REFERENCES `rabbit_breeding` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_litters`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_mortality`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_mortality` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rabbit_id` int NOT NULL,
  `mortality_date` date NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `cause` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rabbit_id` (`rabbit_id`),
  CONSTRAINT `rabbit_mortality_ibfk_1` FOREIGN KEY (`rabbit_id`) REFERENCES `rabbits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_mortality`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_vaccinations`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rabbit_id` int NOT NULL,
  `vaccination_date` date NOT NULL,
  `vaccine_name` varchar(150) NOT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `administered_by` varchar(150) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rabbit_vaccinations` (`rabbit_id`),
  CONSTRAINT `fk_rabbit_vaccinations` FOREIGN KEY (`rabbit_id`) REFERENCES `rabbits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_vaccinations`
--
/*!40000/*!40000--
-- Table structure for table `rabbit_weight`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbit_weight` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rabbit_id` int NOT NULL,
  `weight_date` date NOT NULL,
  `weight` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT 'kg',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rabbit_id` (`rabbit_id`),
  CONSTRAINT `rabbit_weight_ibfk_1` FOREIGN KEY (`rabbit_id`) REFERENCES `rabbits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit_weight`
--
/*!40000/*!40000--
-- Table structure for table `rabbits`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `rabbits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_number` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `breed` varchar(100) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `source` varchar(150) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `status` enum('Active','Sold','Dead') DEFAULT 'Active',
  `purchase_price` decimal(12,2) DEFAULT '0.00',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_number` (`tag_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbits`
--
/*!40000/*!40000--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 /*!40000 /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-09 20:35:18


