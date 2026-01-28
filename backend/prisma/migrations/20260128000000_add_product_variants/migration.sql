-- AlterTable: Add productType and variants to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "product_type" VARCHAR(20);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "variants" JSONB;

-- AlterTable: Add variant to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "variant" JSONB;
