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
  availableForWork: boolean;
  about: string;
};