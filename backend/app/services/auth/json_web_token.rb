module Auth
  class JsonWebToken
    ALGORITHM = "HS256"

    class << self
      def encode(payload, expires_at: 12.hours.from_now)
        JWT.encode(payload.merge(exp: expires_at.to_i), secret, ALGORITHM)
      end

      def decode(token)
        JWT.decode(token, secret, true, algorithm: ALGORITHM).first.with_indifferent_access
      end

      private

      def secret
        ENV.fetch("JWT_SECRET_KEY") { Rails.application.secret_key_base }
      end
    end
  end
end
