module RequestHelpers
  def json
    JSON.parse(response.body)
  end

  def auth_headers_for(user)
    Devise::JWT::TestHelpers.auth_headers({ "Accept" => "application/json" }, user)
  end
end
