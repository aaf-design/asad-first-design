export interface Design {
  id: string;
  title: string;
  description: string;
  image_url: string;
  user_id: string;
  created_at: string;
}

export type DesignFormData = Omit<Design, "id" | "user_id" | "created_at" | "image_url"> & {
  imageFile: File | null;
};
