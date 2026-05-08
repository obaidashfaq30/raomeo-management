class SearchIndex < ApplicationRecord
  validates :indexed_type, :indexed_id, :content, presence: true

  def self.upsert_record(record)
    index = find_or_initialize_by(indexed_type: record.class.name, indexed_id: record.id)
    index.content = content_for(record)
    index.metadata = metadata_for(record)
    index.save!
  end

  def self.content_for(record)
    case record
    when Guest
      [record.full_name, record.email, record.phone, record.document_number, record.preferences].compact.join(" ")
    when Reservation
      [record.code, record.status, record.source, record.primary_guest&.full_name, record.room&.number].compact.join(" ")
    when Room
      [record.number, record.status, record.room_category.name, record.floor].compact.join(" ")
    when Invoice
      [record.number, record.status, record.guest.full_name, record.reservation.code].compact.join(" ")
    when RoomCategory
      [record.name, record.description, record.amenities.pluck(:name)].flatten.compact.join(" ")
    else
      record.attributes.values.compact.join(" ")
    end
  end

  def self.metadata_for(record)
    {
      type: record.class.name.underscore,
      id: record.id,
      label: record.respond_to?(:full_name) ? record.full_name : record.try(:number) || record.try(:code) || record.try(:name)
    }
  end
end
