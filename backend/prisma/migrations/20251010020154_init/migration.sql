-- CreateTable
CREATE TABLE `Parcel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrapeType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GrapeType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disease` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `severity` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Disease_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Planting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcelId` INTEGER NOT NULL,
    `grapeTypeId` INTEGER NOT NULL,
    `sowDate` DATETIME(3) NOT NULL,
    `labBrix` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlantingDisease` (
    `plantingId` INTEGER NOT NULL,
    `diseaseId` INTEGER NOT NULL,
    `detectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`plantingId`, `diseaseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Harvest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plantingId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantityKg` DOUBLE NOT NULL,
    `quality` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Planting` ADD CONSTRAINT `Planting_parcelId_fkey` FOREIGN KEY (`parcelId`) REFERENCES `Parcel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planting` ADD CONSTRAINT `Planting_grapeTypeId_fkey` FOREIGN KEY (`grapeTypeId`) REFERENCES `GrapeType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlantingDisease` ADD CONSTRAINT `PlantingDisease_plantingId_fkey` FOREIGN KEY (`plantingId`) REFERENCES `Planting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlantingDisease` ADD CONSTRAINT `PlantingDisease_diseaseId_fkey` FOREIGN KEY (`diseaseId`) REFERENCES `Disease`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Harvest` ADD CONSTRAINT `Harvest_plantingId_fkey` FOREIGN KEY (`plantingId`) REFERENCES `Planting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
