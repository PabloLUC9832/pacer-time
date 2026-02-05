-- CreateEnum
CREATE TYPE "Method" AS ENUM ('ONLINE', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ORGANIZER', 'COMPETITOR');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "min_age" INTEGER,
    "max_age" INTEGER,
    "has_age_limit" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "registration_method" "Method" NOT NULL,
    "bib" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "father_last_name" TEXT NOT NULL,
    "mother_last_name" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "club" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT,
    "allergies" TEXT,
    "emergency_phone_number" TEXT,
    "custom_fields" JSONB,
    "size_tshirt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "starts_date" TIMESTAMP(3) NOT NULL,
    "ends_date" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT,
    "edition" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "requires_tshirt_size" BOOLEAN NOT NULL,
    "customs_questions" JSONB,
    "waiver_url" TEXT,
    "website_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_modalities_genders_categories" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "modality_id" TEXT NOT NULL,
    "gender_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_modalities_genders_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "father_last_name" TEXT NOT NULL,
    "mother_last_name" TEXT,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COMPETITOR',
    "event_name" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "competitors_event_id_idx" ON "competitors"("event_id");

-- CreateIndex
CREATE INDEX "events_user_id_idx" ON "events"("user_id");

-- CreateIndex
CREATE INDEX "events_modalities_genders_categories_event_id_modality_id_g_idx" ON "events_modalities_genders_categories"("event_id", "modality_id", "gender_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_modalities_genders_categories_event_id_modality_id_g_key" ON "events_modalities_genders_categories"("event_id", "modality_id", "gender_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_event_name_key" ON "users"("event_name");

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_modalities_genders_categories" ADD CONSTRAINT "events_modalities_genders_categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_modalities_genders_categories" ADD CONSTRAINT "events_modalities_genders_categories_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "modalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_modalities_genders_categories" ADD CONSTRAINT "events_modalities_genders_categories_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_modalities_genders_categories" ADD CONSTRAINT "events_modalities_genders_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
