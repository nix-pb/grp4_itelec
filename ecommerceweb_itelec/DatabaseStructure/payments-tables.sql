CREATE TABLE `payment_methods` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO payment_methods (id,name,description,imagePath,isActive,createdAt,updatedAt,isDefault) VALUES
	 (1,'Cash on Delivery','','cod.png',1,'2024-12-05 18:08:27','2024-12-05 18:08:27',1),
	 (2,'GCash e-Wallet','','gcash.jpg',0,'2024-12-05 18:08:27','2024-12-05 18:08:27',0);

CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  `itemCount` int DEFAULT NULL,
  `itemPrice` int DEFAULT NULL,
  `shippingFee` decimal(10,2) DEFAULT NULL,
  `paymentMethodId` int DEFAULT '1',
  `status` varchar(25) DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;