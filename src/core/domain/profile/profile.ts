export type Stat = {
  value: string;
  label: string;
};

export type Profile = {
  name: string;
  role: string;
  availability: string;
  headline: { text: string; accent: string };
  summary: string;
  stats: Stat[];
};
