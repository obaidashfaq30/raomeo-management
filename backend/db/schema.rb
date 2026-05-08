# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_05_08_120000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "amenities", force: :cascade do |t|
    t.string "name", null: false
    t.string "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_amenities_on_name", unique: true
  end

  create_table "audit_logs", force: :cascade do |t|
    t.bigint "actor_id"
    t.string "action", null: false
    t.string "auditable_type"
    t.bigint "auditable_id"
    t.jsonb "metadata", default: {}, null: false
    t.string "request_id"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["action", "created_at"], name: "index_audit_logs_on_action_and_created_at"
    t.index ["actor_id"], name: "index_audit_logs_on_actor_id"
    t.index ["auditable_type", "auditable_id"], name: "index_audit_logs_on_auditable_type_and_auditable_id"
  end

  create_table "food_beverage_order_items", force: :cascade do |t|
    t.bigint "food_beverage_order_id", null: false
    t.string "name", null: false
    t.integer "quantity", default: 1, null: false
    t.integer "unit_price_cents", default: 0, null: false
    t.integer "total_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["food_beverage_order_id"], name: "index_food_beverage_order_items_on_food_beverage_order_id"
  end

  create_table "food_beverage_orders", force: :cascade do |t|
    t.bigint "room_id"
    t.bigint "guest_id"
    t.bigint "reservation_id"
    t.bigint "invoice_id"
    t.integer "status", default: 0, null: false
    t.integer "total_cents", default: 0, null: false
    t.string "source", default: "room_service", null: false
    t.datetime "ordered_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["guest_id"], name: "index_food_beverage_orders_on_guest_id"
    t.index ["invoice_id"], name: "index_food_beverage_orders_on_invoice_id"
    t.index ["reservation_id"], name: "index_food_beverage_orders_on_reservation_id"
    t.index ["room_id"], name: "index_food_beverage_orders_on_room_id"
    t.index ["status", "ordered_at"], name: "index_food_beverage_orders_on_status_and_ordered_at"
  end

  create_table "guests", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email"
    t.string "phone"
    t.string "document_type"
    t.string "document_number"
    t.text "preferences"
    t.text "notes"
    t.integer "loyalty_points", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_guests_on_email"
    t.index ["last_name", "first_name"], name: "index_guests_on_last_name_and_first_name"
    t.index ["phone"], name: "index_guests_on_phone"
  end

  create_table "housekeeping_tasks", force: :cascade do |t|
    t.bigint "room_id", null: false
    t.bigint "assigned_to_id"
    t.date "scheduled_for", null: false
    t.integer "status", default: 0, null: false
    t.string "task_type", default: "cleaning", null: false
    t.text "notes"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id", "status"], name: "index_housekeeping_tasks_on_assigned_to_id_and_status"
    t.index ["assigned_to_id"], name: "index_housekeeping_tasks_on_assigned_to_id"
    t.index ["room_id"], name: "index_housekeeping_tasks_on_room_id"
    t.index ["scheduled_for", "status"], name: "index_housekeeping_tasks_on_scheduled_for_and_status"
  end

  create_table "invoices", force: :cascade do |t|
    t.string "number", null: false
    t.bigint "reservation_id", null: false
    t.bigint "guest_id", null: false
    t.integer "subtotal_cents", default: 0, null: false
    t.integer "tax_cents", default: 0, null: false
    t.integer "discount_cents", default: 0, null: false
    t.integer "total_cents", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.date "issued_on", null: false
    t.date "due_on"
    t.jsonb "line_items", default: [], null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["guest_id"], name: "index_invoices_on_guest_id"
    t.index ["number"], name: "index_invoices_on_number", unique: true
    t.index ["reservation_id"], name: "index_invoices_on_reservation_id"
    t.index ["status", "issued_on"], name: "index_invoices_on_status_and_issued_on"
  end

  create_table "maintenance_tickets", force: :cascade do |t|
    t.bigint "room_id", null: false
    t.bigint "reported_by_id"
    t.bigint "assigned_to_id"
    t.string "title", null: false
    t.text "description"
    t.integer "priority", default: 1, null: false
    t.integer "status", default: 0, null: false
    t.datetime "resolved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id"], name: "index_maintenance_tickets_on_assigned_to_id"
    t.index ["reported_by_id"], name: "index_maintenance_tickets_on_reported_by_id"
    t.index ["room_id", "status"], name: "index_maintenance_tickets_on_room_id_and_status"
    t.index ["room_id"], name: "index_maintenance_tickets_on_room_id"
    t.index ["status", "priority"], name: "index_maintenance_tickets_on_status_and_priority"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title", null: false
    t.text "message", null: false
    t.string "category", default: "front_desk", null: false
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "read_at"], name: "index_notifications_on_user_id_and_read_at"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "invoice_id", null: false
    t.bigint "received_by_id"
    t.integer "amount_cents", null: false
    t.string "method", default: "cash", null: false
    t.string "reference"
    t.datetime "paid_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_payments_on_invoice_id"
    t.index ["paid_at"], name: "index_payments_on_paid_at"
    t.index ["received_by_id"], name: "index_payments_on_received_by_id"
  end

  create_table "refunds", force: :cascade do |t|
    t.bigint "invoice_id", null: false
    t.bigint "processed_by_id"
    t.integer "amount_cents", null: false
    t.string "reason", null: false
    t.datetime "refunded_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_refunds_on_invoice_id"
    t.index ["processed_by_id"], name: "index_refunds_on_processed_by_id"
  end

  create_table "reservation_guests", force: :cascade do |t|
    t.bigint "reservation_id", null: false
    t.bigint "guest_id", null: false
    t.boolean "primary_guest", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["guest_id"], name: "index_reservation_guests_on_guest_id"
    t.index ["reservation_id", "guest_id"], name: "index_reservation_guests_on_reservation_id_and_guest_id", unique: true
    t.index ["reservation_id"], name: "index_reservation_guests_on_reservation_id"
  end

  create_table "reservations", force: :cascade do |t|
    t.string "code", null: false
    t.bigint "room_category_id", null: false
    t.bigint "room_id"
    t.date "check_in_date", null: false
    t.date "check_out_date", null: false
    t.integer "adults", default: 1, null: false
    t.integer "children", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.integer "rate_cents", default: 0, null: false
    t.string "source", default: "direct", null: false
    t.text "special_requests"
    t.datetime "cancelled_at"
    t.bigint "created_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_reservations_on_code", unique: true
    t.index ["created_by_id"], name: "index_reservations_on_created_by_id"
    t.index ["room_category_id", "status", "check_in_date", "check_out_date"], name: "idx_reservations_category_status_dates"
    t.index ["room_category_id"], name: "index_reservations_on_room_category_id"
    t.index ["room_id", "status", "check_in_date", "check_out_date"], name: "idx_reservations_room_status_dates"
    t.index ["room_id"], name: "index_reservations_on_room_id"
  end

  create_table "room_categories", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.integer "base_rate_cents", default: 0, null: false
    t.integer "max_occupancy", default: 2, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_room_categories_on_name", unique: true
  end

  create_table "room_category_amenities", force: :cascade do |t|
    t.bigint "room_category_id", null: false
    t.bigint "amenity_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["amenity_id"], name: "index_room_category_amenities_on_amenity_id"
    t.index ["room_category_id", "amenity_id"], name: "idx_room_category_amenities_unique", unique: true
    t.index ["room_category_id"], name: "index_room_category_amenities_on_room_category_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.bigint "room_category_id", null: false
    t.string "number", null: false
    t.integer "floor", null: false
    t.integer "status", default: 0, null: false
    t.integer "rate_override_cents"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["floor", "status"], name: "index_rooms_on_floor_and_status"
    t.index ["number"], name: "index_rooms_on_number", unique: true
    t.index ["room_category_id", "status"], name: "index_rooms_on_room_category_id_and_status"
    t.index ["room_category_id"], name: "index_rooms_on_room_category_id"
  end

  create_table "search_indices", force: :cascade do |t|
    t.string "indexed_type", null: false
    t.bigint "indexed_id", null: false
    t.text "content", null: false
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content"], name: "index_search_indices_on_content", opclass: :gin_trgm_ops, using: :gin
    t.index ["indexed_type", "indexed_id"], name: "index_search_indices_on_indexed_type_and_indexed_id", unique: true
  end

  create_table "stays", force: :cascade do |t|
    t.bigint "reservation_id", null: false
    t.bigint "room_id", null: false
    t.bigint "guest_id", null: false
    t.datetime "checked_in_at", null: false
    t.datetime "checked_out_at"
    t.boolean "late_checkout", default: false, null: false
    t.text "checkout_notes"
    t.bigint "checked_in_by_id"
    t.bigint "checked_out_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["checked_in_by_id"], name: "index_stays_on_checked_in_by_id"
    t.index ["checked_out_by_id"], name: "index_stays_on_checked_out_by_id"
    t.index ["guest_id"], name: "index_stays_on_guest_id"
    t.index ["reservation_id"], name: "index_stays_on_reservation_id"
    t.index ["room_id", "checked_out_at"], name: "index_stays_on_room_id_and_checked_out_at"
    t.index ["room_id"], name: "index_stays_on_room_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.integer "role", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.datetime "last_login_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role", "active"], name: "index_users_on_role_and_active"
  end

  add_foreign_key "audit_logs", "users", column: "actor_id"
  add_foreign_key "food_beverage_order_items", "food_beverage_orders"
  add_foreign_key "food_beverage_orders", "guests"
  add_foreign_key "food_beverage_orders", "invoices"
  add_foreign_key "food_beverage_orders", "reservations"
  add_foreign_key "food_beverage_orders", "rooms"
  add_foreign_key "housekeeping_tasks", "rooms"
  add_foreign_key "housekeeping_tasks", "users", column: "assigned_to_id"
  add_foreign_key "invoices", "guests"
  add_foreign_key "invoices", "reservations"
  add_foreign_key "maintenance_tickets", "rooms"
  add_foreign_key "maintenance_tickets", "users", column: "assigned_to_id"
  add_foreign_key "maintenance_tickets", "users", column: "reported_by_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "payments", "invoices"
  add_foreign_key "payments", "users", column: "received_by_id"
  add_foreign_key "refunds", "invoices"
  add_foreign_key "refunds", "users", column: "processed_by_id"
  add_foreign_key "reservation_guests", "guests"
  add_foreign_key "reservation_guests", "reservations"
  add_foreign_key "reservations", "room_categories"
  add_foreign_key "reservations", "rooms"
  add_foreign_key "reservations", "users", column: "created_by_id"
  add_foreign_key "room_category_amenities", "amenities"
  add_foreign_key "room_category_amenities", "room_categories"
  add_foreign_key "rooms", "room_categories"
  add_foreign_key "stays", "guests"
  add_foreign_key "stays", "reservations"
  add_foreign_key "stays", "rooms"
  add_foreign_key "stays", "users", column: "checked_in_by_id"
  add_foreign_key "stays", "users", column: "checked_out_by_id"
end
