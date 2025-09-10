class OTPStore {
  private store: Record<string, string> = {};

  // Set OTP
  set(email: string, otp: string) {
    this.store[email] = otp;
    // console.log(this.store);
  }

  // Get OTP
  get(email: string): string | undefined {
    return this.store[email];
  }

  // Delete OTP
  delete(email: string) {
    delete this.store[email];
  }

  // Optional: clear all OTPs
  clear() {
    this.store = {};
  }
}

// Export a single instance
export const otpStore = new OTPStore();