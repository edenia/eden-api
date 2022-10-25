CREATE TABLE "public"."access" ("account" varchar NOT NULL, "role" varchar NOT NULL, "access_token" varchar NOT NULL, "state" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("account") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_access_updated_at"
BEFORE UPDATE ON "public"."access"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_access_updated_at" ON "public"."access" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
