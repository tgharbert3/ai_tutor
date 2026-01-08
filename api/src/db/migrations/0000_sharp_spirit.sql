CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`courseId` integer NOT NULL,
	`courseName` text,
	`courseCode` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_courseId_unique` ON `users` (`courseId`);