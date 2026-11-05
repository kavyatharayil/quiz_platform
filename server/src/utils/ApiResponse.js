class ApiResponse {
  constructor(statusCode, message = 'Success', data = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

module.exports = ApiResponse;
