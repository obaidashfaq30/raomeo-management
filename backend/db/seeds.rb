# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
admin = User.find_or_create_by!(email: "admin@raomeo.test") do |user|
  user.name = "Raomeo Admin"
  user.password = "password123"
  user.role = :admin
end

front_desk = User.find_or_create_by!(email: "frontdesk@raomeo.test") do |user|
  user.name = "Front Desk Staff"
  user.password = "password123"
  user.role = :front_desk
end

housekeeper = User.find_or_create_by!(email: "housekeeping@raomeo.test") do |user|
  user.name = "Housekeeping Staff"
  user.password = "password123"
  user.role = :housekeeping
end

accountant = User.find_or_create_by!(email: "accountant@raomeo.test") do |user|
  user.name = "Accountant"
  user.password = "password123"
  user.role = :accountant
end

manager = User.find_or_create_by!(email: "manager@raomeo.test") do |user|
  user.name = "Hotel Manager"
  user.password = "password123"
  user.role = :manager
end

amenities = %w[WiFi Breakfast Parking Pool Spa Workspace Minibar Balcony].index_with do |name|
  Amenity.find_or_create_by!(name: name)
end

regular = RoomCategory.find_or_create_by!(name: "Regular") do |category|
  category.description = "Comfortable standard room for short stays."
  category.base_rate_cents = 8_500
  category.max_occupancy = 2
end
regular.amenities = amenities.values_at("WiFi", "Breakfast", "Parking")

deluxe = RoomCategory.find_or_create_by!(name: "Deluxe") do |category|
  category.description = "Spacious room with enhanced amenities."
  category.base_rate_cents = 14_500
  category.max_occupancy = 3
end
deluxe.amenities = amenities.values_at("WiFi", "Breakfast", "Pool", "Workspace", "Minibar")

suite = RoomCategory.find_or_create_by!(name: "Suites") do |category|
  category.description = "Premium suite with lounge area and balcony."
  category.base_rate_cents = 28_000
  category.max_occupancy = 4
end
suite.amenities = amenities.values_at("WiFi", "Breakfast", "Pool", "Spa", "Workspace", "Minibar", "Balcony")

[
  [regular, 1, 10],
  [deluxe, 2, 8],
  [suite, 3, 4]
].each do |category, floor, count|
  count.times do |index|
    Room.find_or_create_by!(number: "#{floor}#{(index + 1).to_s.rjust(2, "0")}") do |room|
      room.room_category = category
      room.floor = floor
      room.status = :available
    end
  end
end

guest = Guest.find_or_create_by!(email: "sophia.chen@example.com") do |record|
  record.first_name = "Sophia"
  record.last_name = "Chen"
  record.phone = "+1 555 0101"
  record.document_type = "passport"
  record.document_number = "P1234567"
  record.preferences = "High floor, quiet room"
  record.loyalty_points = 320
end

reservation = Reservation.joins(:reservation_guests).find_by(
  reservation_guests: { guest_id: guest.id },
  room_category: deluxe,
  check_in_date: Date.current,
  check_out_date: Date.current + 2.days,
  source: "direct"
) || Reservations::CreateReservation.new(
  actor: front_desk,
  params: {
    room_category_id: deluxe.id,
    check_in_date: Date.current,
    check_out_date: Date.current + 2.days,
    adults: 2,
    children: 0,
    source: "direct",
    guest_ids: [guest.id]
  }
).call

HousekeepingTask.find_or_create_by!(room: reservation.room, scheduled_for: Date.current, task_type: "pre-arrival") do |task|
  task.assigned_to = housekeeper
  task.status = :pending
  task.notes = "Refresh minibar and confirm welcome package."
end

unless reservation.food_beverage_orders.exists?(source: "room_service")
  FoodBeverageOrder.create!(
    reservation: reservation,
    room: reservation.room,
    guest: guest,
    status: :delivered,
    source: "room_service",
    ordered_at: Time.current,
    food_beverage_order_items_attributes: [
      { name: "Club sandwich", quantity: 2, unit_price_cents: 1_800 },
      { name: "Fresh juice", quantity: 2, unit_price_cents: 650 }
    ]
  )
end

[RoomCategory, Room, Guest, Reservation, Invoice].each do |model|
  model.find_each { |record| SearchIndex.upsert_record(record) }
end

puts "Seeded Raomeo Management users: #{[admin, front_desk, housekeeper, accountant, manager].map(&:email).join(", ")}"
