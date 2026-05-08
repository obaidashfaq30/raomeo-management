class CreateHotelManagementSchema < ActiveRecord::Migration[7.2]
  def change
    enable_extension "pg_trgm" unless extension_enabled?("pg_trgm")

    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.integer :role, null: false, default: 0
      t.boolean :active, null: false, default: true
      t.datetime :last_login_at
      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, %i[role active]

    create_table :room_categories do |t|
      t.string :name, null: false
      t.text :description
      t.integer :base_rate_cents, null: false, default: 0
      t.integer :max_occupancy, null: false, default: 2
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :room_categories, :name, unique: true

    create_table :amenities do |t|
      t.string :name, null: false
      t.string :icon
      t.timestamps
    end
    add_index :amenities, :name, unique: true

    create_table :room_category_amenities do |t|
      t.references :room_category, null: false, foreign_key: true
      t.references :amenity, null: false, foreign_key: true
      t.timestamps
    end
    add_index :room_category_amenities, %i[room_category_id amenity_id], unique: true, name: "idx_room_category_amenities_unique"

    create_table :rooms do |t|
      t.references :room_category, null: false, foreign_key: true
      t.string :number, null: false
      t.integer :floor, null: false
      t.integer :status, null: false, default: 0
      t.integer :rate_override_cents
      t.jsonb :metadata, null: false, default: {}
      t.timestamps
    end
    add_index :rooms, :number, unique: true
    add_index :rooms, %i[room_category_id status]
    add_index :rooms, %i[floor status]

    create_table :guests do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email
      t.string :phone
      t.string :document_type
      t.string :document_number
      t.text :preferences
      t.text :notes
      t.integer :loyalty_points, null: false, default: 0
      t.timestamps
    end
    add_index :guests, :email
    add_index :guests, :phone
    add_index :guests, %i[last_name first_name]

    create_table :reservations do |t|
      t.string :code, null: false
      t.references :room_category, null: false, foreign_key: true
      t.references :room, foreign_key: true
      t.date :check_in_date, null: false
      t.date :check_out_date, null: false
      t.integer :adults, null: false, default: 1
      t.integer :children, null: false, default: 0
      t.integer :status, null: false, default: 0
      t.integer :rate_cents, null: false, default: 0
      t.string :source, null: false, default: "direct"
      t.text :special_requests
      t.datetime :cancelled_at
      t.references :created_by, foreign_key: { to_table: :users }
      t.timestamps
    end
    add_index :reservations, :code, unique: true
    add_index :reservations, %i[room_id status check_in_date check_out_date], name: "idx_reservations_room_status_dates"
    add_index :reservations, %i[room_category_id status check_in_date check_out_date], name: "idx_reservations_category_status_dates"

    create_table :reservation_guests do |t|
      t.references :reservation, null: false, foreign_key: true
      t.references :guest, null: false, foreign_key: true
      t.boolean :primary_guest, null: false, default: false
      t.timestamps
    end
    add_index :reservation_guests, %i[reservation_id guest_id], unique: true

    create_table :stays do |t|
      t.references :reservation, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true
      t.references :guest, null: false, foreign_key: true
      t.datetime :checked_in_at, null: false
      t.datetime :checked_out_at
      t.boolean :late_checkout, null: false, default: false
      t.text :checkout_notes
      t.references :checked_in_by, foreign_key: { to_table: :users }
      t.references :checked_out_by, foreign_key: { to_table: :users }
      t.timestamps
    end
    add_index :stays, %i[room_id checked_out_at]

    create_table :housekeeping_tasks do |t|
      t.references :room, null: false, foreign_key: true
      t.references :assigned_to, foreign_key: { to_table: :users }
      t.date :scheduled_for, null: false
      t.integer :status, null: false, default: 0
      t.string :task_type, null: false, default: "cleaning"
      t.text :notes
      t.datetime :completed_at
      t.timestamps
    end
    add_index :housekeeping_tasks, %i[scheduled_for status]
    add_index :housekeeping_tasks, %i[assigned_to_id status]

    create_table :maintenance_tickets do |t|
      t.references :room, null: false, foreign_key: true
      t.references :reported_by, foreign_key: { to_table: :users }
      t.references :assigned_to, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description
      t.integer :priority, null: false, default: 1
      t.integer :status, null: false, default: 0
      t.datetime :resolved_at
      t.timestamps
    end
    add_index :maintenance_tickets, %i[status priority]
    add_index :maintenance_tickets, %i[room_id status]

    create_table :invoices do |t|
      t.string :number, null: false
      t.references :reservation, null: false, foreign_key: true
      t.references :guest, null: false, foreign_key: true
      t.integer :subtotal_cents, null: false, default: 0
      t.integer :tax_cents, null: false, default: 0
      t.integer :discount_cents, null: false, default: 0
      t.integer :total_cents, null: false, default: 0
      t.integer :status, null: false, default: 0
      t.date :issued_on, null: false
      t.date :due_on
      t.jsonb :line_items, null: false, default: []
      t.timestamps
    end
    add_index :invoices, :number, unique: true
    add_index :invoices, %i[status issued_on]

    create_table :payments do |t|
      t.references :invoice, null: false, foreign_key: true
      t.references :received_by, foreign_key: { to_table: :users }
      t.integer :amount_cents, null: false
      t.string :method, null: false, default: "cash"
      t.string :reference
      t.datetime :paid_at, null: false
      t.timestamps
    end
    add_index :payments, :paid_at

    create_table :refunds do |t|
      t.references :invoice, null: false, foreign_key: true
      t.references :processed_by, foreign_key: { to_table: :users }
      t.integer :amount_cents, null: false
      t.string :reason, null: false
      t.datetime :refunded_at, null: false
      t.timestamps
    end

    create_table :food_beverage_orders do |t|
      t.references :room, foreign_key: true
      t.references :guest, foreign_key: true
      t.references :reservation, foreign_key: true
      t.references :invoice, foreign_key: true
      t.integer :status, null: false, default: 0
      t.integer :total_cents, null: false, default: 0
      t.string :source, null: false, default: "room_service"
      t.datetime :ordered_at, null: false
      t.timestamps
    end
    add_index :food_beverage_orders, %i[status ordered_at]

    create_table :food_beverage_order_items do |t|
      t.references :food_beverage_order, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :quantity, null: false, default: 1
      t.integer :unit_price_cents, null: false, default: 0
      t.integer :total_cents, null: false, default: 0
      t.timestamps
    end

    create_table :notifications do |t|
      t.references :user, foreign_key: true
      t.string :title, null: false
      t.text :message, null: false
      t.string :category, null: false, default: "front_desk"
      t.datetime :read_at
      t.timestamps
    end
    add_index :notifications, %i[user_id read_at]

    create_table :audit_logs do |t|
      t.references :actor, foreign_key: { to_table: :users }
      t.string :action, null: false
      t.string :auditable_type
      t.bigint :auditable_id
      t.jsonb :metadata, null: false, default: {}
      t.string :request_id
      t.string :ip_address
      t.timestamps
    end
    add_index :audit_logs, %i[auditable_type auditable_id]
    add_index :audit_logs, %i[action created_at]

    create_table :search_indices do |t|
      t.string :indexed_type, null: false
      t.bigint :indexed_id, null: false
      t.text :content, null: false
      t.jsonb :metadata, null: false, default: {}
      t.timestamps
    end
    add_index :search_indices, %i[indexed_type indexed_id], unique: true
    add_index :search_indices, :content, using: :gin, opclass: :gin_trgm_ops
  end
end
