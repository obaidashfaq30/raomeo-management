module Audit
  class Recorder
    def self.call(actor:, action:, auditable: nil, metadata: {}, request: nil)
      AuditLog.create!(
        actor: actor,
        action: action,
        auditable_type: auditable&.class&.name,
        auditable_id: auditable&.id,
        metadata: metadata,
        request_id: request&.request_id,
        ip_address: request&.remote_ip
      )
    end
  end
end
