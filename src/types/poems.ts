
export interface ExternalPoemSource {
  id: string;
  name: string;
  url: string;
  api_endpoint: string | null;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExternalPoem {
  id: string;
  external_id: string;
  title: string;
  author: string;
  content: string;
  category: string | null;
  source_id: string | null;
  original_url: string | null;
  is_active: boolean;
  created_at: string;
  sync_date: string | null;
}

export interface AllPoem {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  user_id: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  audio_url: string | null;
  external_author: string | null;
  source_type: string | null;
  original_url: string | null;
}
