CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'worker',
  active TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS chickens (
  id INT NOT NULL AUTO_INCREMENT,
  tag_number VARCHAR(100) NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  breed VARCHAR(100) DEFAULT NULL,
  type VARCHAR(100) DEFAULT NULL,
  sex VARCHAR(20) DEFAULT NULL,
  hatch_date DATE DEFAULT NULL,
  source VARCHAR(150) DEFAULT NULL,
  quantity INT DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  purchase_price DECIMAL(12,2) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_chicken_tag (tag_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbits (
  id INT NOT NULL AUTO_INCREMENT,
  tag VARCHAR(100) NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  breed VARCHAR(100) DEFAULT NULL,
  sex VARCHAR(20) DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  weight DECIMAL(10,2) DEFAULT NULL,
  color VARCHAR(100) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_rabbit_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chicken_mortality (
  id INT NOT NULL AUTO_INCREMENT,
  chicken_id INT NOT NULL,
  mortality_date DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  cause VARCHAR(255) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY chicken_id (chicken_id),
  CONSTRAINT chicken_mortality_ibfk_1
    FOREIGN KEY (chicken_id) REFERENCES chickens(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chicken_vaccinations (
  id INT NOT NULL AUTO_INCREMENT,
  chicken_id INT NOT NULL,
  vaccination_date DATE NOT NULL,
  vaccine_name VARCHAR(150) NOT NULL,
  dosage VARCHAR(100) DEFAULT NULL,
  next_due_date DATE DEFAULT NULL,
  administered_by VARCHAR(150) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY chicken_id (chicken_id),
  CONSTRAINT fk_chicken_vaccinations
    FOREIGN KEY (chicken_id) REFERENCES chickens(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS egg_production (
  id INT NOT NULL AUTO_INCREMENT,
  chicken_id INT NOT NULL,
  production_date DATE NOT NULL,
  eggs_collected INT NOT NULL,
  cracked_eggs INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY chicken_id (chicken_id),
  CONSTRAINT fk_egg_chicken
    FOREIGN KEY (chicken_id) REFERENCES chickens(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS egg_sales (
  id INT NOT NULL AUTO_INCREMENT,
  sale_date DATE NOT NULL,
  customer VARCHAR(150) DEFAULT NULL,
  quantity INT NOT NULL,
  price_per_egg DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('Cash','M-PESA','Bank') DEFAULT 'Cash',
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS feed (
  id INT NOT NULL AUTO_INCREMENT,
  feed_name VARCHAR(150) NOT NULL,
  category ENUM('Goat','Chicken','Rabbit','General') NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  minimum_stock DECIMAL(12,2) DEFAULT 0.00,
  cost_per_unit DECIMAL(12,2) DEFAULT 0.00,
  supplier VARCHAR(150) DEFAULT NULL,
  purchase_date DATE DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS feed_usage (
  id INT NOT NULL AUTO_INCREMENT,
  feed_id INT NOT NULL,
  animal_type ENUM('Goat','Chicken','Rabbit') NOT NULL,
  animal_id INT DEFAULT NULL,
  quantity_used DECIMAL(12,2) NOT NULL,
  usage_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY feed_id (feed_id),
  CONSTRAINT fk_feed_usage_feed
    FOREIGN KEY (feed_id) REFERENCES feed(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS finance (
  id INT NOT NULL AUTO_INCREMENT,
  transaction_date DATE NOT NULL,
  type ENUM('Income','Expense') NOT NULL,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('Cash','M-PESA','Bank') DEFAULT 'Cash',
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_breeding (
  id INT NOT NULL AUTO_INCREMENT,
  doe_id INT NOT NULL,
  buck_id INT NOT NULL,
  mating_date DATE NOT NULL,
  expected_kidding DATE NOT NULL,
  pregnancy_status ENUM('Open','Pregnant','Confirmed','Aborted','Kidded') DEFAULT 'Pregnant',
  pregnancy_days INT DEFAULT 0,
  veterinarian VARCHAR(100) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY doe_id (doe_id),
  KEY buck_id (buck_id),
  CONSTRAINT goat_breeding_ibfk_1
    FOREIGN KEY (doe_id) REFERENCES goats(id)
    ON DELETE CASCADE,
  CONSTRAINT goat_breeding_ibfk_2
    FOREIGN KEY (buck_id) REFERENCES goats(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_health (
  id INT NOT NULL AUTO_INCREMENT,
  goat_id INT NOT NULL,
  record_date DATE NOT NULL,
  record_type VARCHAR(50) NOT NULL,
  medicine VARCHAR(100) DEFAULT NULL,
  dosage VARCHAR(100) DEFAULT NULL,
  veterinarian VARCHAR(100) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY goat_id (goat_id),
  CONSTRAINT fk_goat_health
    FOREIGN KEY (goat_id) REFERENCES goats(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_kidding (
  id INT NOT NULL AUTO_INCREMENT,
  breeding_id INT NOT NULL,
  kidding_date DATE NOT NULL,
  male_kids INT DEFAULT 0,
  female_kids INT DEFAULT 0,
  stillborn INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY breeding_id (breeding_id),
  CONSTRAINT goat_kidding_ibfk_1
    FOREIGN KEY (breeding_id) REFERENCES goat_breeding(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_kids (
  id INT NOT NULL AUTO_INCREMENT,
  kidding_id INT NOT NULL,
  goat_id INT DEFAULT NULL,
  tag VARCHAR(50) DEFAULT NULL,
  sex ENUM('Male','Female') DEFAULT NULL,
  birth_weight DECIMAL(5,2) DEFAULT NULL,
  colour VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Healthy',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY kidding_id (kidding_id),
  CONSTRAINT goat_kids_ibfk_1
    FOREIGN KEY (kidding_id) REFERENCES goat_kidding(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_photos (
  id INT NOT NULL AUTO_INCREMENT,
  goat_id INT NOT NULL,
  photo VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY goat_id (goat_id),
  CONSTRAINT goat_photos_ibfk_1
    FOREIGN KEY (goat_id) REFERENCES goats(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goat_weights (
  id INT NOT NULL AUTO_INCREMENT,
  goat_id INT NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  record_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY goat_id (goat_id),
  CONSTRAINT fk_goat_weights
    FOREIGN KEY (goat_id) REFERENCES goats(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 0.00,
  unit VARCHAR(30) NOT NULL,
  minimum_stock DECIMAL(10,2) DEFAULT 0.00,
  purchase_price DECIMAL(12,2) DEFAULT 0.00,
  supplier VARCHAR(150) DEFAULT NULL,
  purchase_date DATE DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_breeding (
  id INT NOT NULL AUTO_INCREMENT,
  rabbit_id INT NOT NULL,
  breeding_date DATE NOT NULL,
  male_rabbit_id INT DEFAULT NULL,
  breeding_type VARCHAR(100) DEFAULT NULL,
  expected_birth_date DATE DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Planned',
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY rabbit_id (rabbit_id),
  KEY male_rabbit_id (male_rabbit_id),
  CONSTRAINT rabbit_breeding_ibfk_1
    FOREIGN KEY (rabbit_id) REFERENCES rabbits(id),
  CONSTRAINT rabbit_breeding_ibfk_2
    FOREIGN KEY (male_rabbit_id) REFERENCES rabbits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_health (
  id INT NOT NULL AUTO_INCREMENT,
  rabbit_id INT NOT NULL,
  treatment_date DATE NOT NULL,
  treatment_type VARCHAR(100) NOT NULL,
  diagnosis VARCHAR(255) DEFAULT NULL,
  medication VARCHAR(255) DEFAULT NULL,
  veterinarian VARCHAR(255) DEFAULT NULL,
  cost DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY rabbit_id (rabbit_id),
  CONSTRAINT rabbit_health_ibfk_1
    FOREIGN KEY (rabbit_id) REFERENCES rabbits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_litters (
  id INT NOT NULL AUTO_INCREMENT,
  breeding_id INT NOT NULL,
  birth_date DATE NOT NULL,
  total_kits INT NOT NULL DEFAULT 0,
  live_kits INT NOT NULL DEFAULT 0,
  dead_kits INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY breeding_id (breeding_id),
  CONSTRAINT rabbit_litters_ibfk_1
    FOREIGN KEY (breeding_id) REFERENCES rabbit_breeding(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_mortality (
  id INT NOT NULL AUTO_INCREMENT,
  rabbit_id INT NOT NULL,
  mortality_date DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  cause VARCHAR(255) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY rabbit_id (rabbit_id),
  CONSTRAINT rabbit_mortality_ibfk_1
    FOREIGN KEY (rabbit_id) REFERENCES rabbits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_vaccinations (
  id INT NOT NULL AUTO_INCREMENT,
  rabbit_id INT NOT NULL,
  vaccination_date DATE NOT NULL,
  vaccine_name VARCHAR(150) NOT NULL,
  dosage VARCHAR(100) DEFAULT NULL,
  next_due_date DATE DEFAULT NULL,
  administered_by VARCHAR(150) DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY rabbit_id (rabbit_id),
  CONSTRAINT fk_rabbit_vaccinations
    FOREIGN KEY (rabbit_id) REFERENCES rabbits(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rabbit_weight (
  id INT NOT NULL AUTO_INCREMENT,
  rabbit_id INT NOT NULL,
  weight_date DATE NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  notes TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY rabbit_id (rabbit_id),
  CONSTRAINT rabbit_weight_ibfk_1
    FOREIGN KEY (rabbit_id) REFERENCES rabbits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
