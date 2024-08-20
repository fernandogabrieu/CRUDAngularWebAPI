const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/loans",
      "/api/customers"
    ],
    target: "https://localhost:7160",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
