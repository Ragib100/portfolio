export type ProfileImage = {
  url: string;
  publicId: string;
};

export type Profile = {
  fullName: string;
  image: ProfileImage | null;
  professionalTitle: string;
  tagline: string;
  location: string;
  phone: number | null;
  availableForWork: boolean;
  about: string;
};
