export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  is_admin: boolean;
  first_login: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  affiliate_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageConfig {
  id: string;
  user_id: string;
  whatsapp_group: string;
  message_template: string;
  send_interval: number; // em minutos
  is_active: boolean;
  last_sent: string | null;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  file_size: number;
  duration: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MessageLog {
  id: string;
  user_id: string;
  product_id: string;
  message_config_id: string;
  message_content: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
}

export interface VerificationCode {
  id: string;
  user_id: string;
  code: string;
  type: 'email' | 'phone';
  expires_at: string;
  used: boolean;
  created_at: string;
}