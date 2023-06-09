export interface AuthenticatedUser {
  id: number | null;
  username: string | null;
  accessToken: string | null;
}
