export type AdminUser = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export type EmailMessage = {
  title: string;
  content: string;
}
