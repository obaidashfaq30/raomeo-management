# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    configured_origins = ENV.fetch("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
                            .split(",")
                            .map(&:strip)
                            .compact_blank
    local_dev_origins = Rails.env.development? ? [%r{\Ahttp://(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\z}] : []

    origins(*(configured_origins + local_dev_origins))

    resource "*",
             headers: :any,
             expose: ["Authorization"],
             methods: %i[get post put patch delete options head]
  end
end
