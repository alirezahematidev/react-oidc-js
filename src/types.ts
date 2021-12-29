export interface UserResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at?: number;
  expires_in?: number;
}
