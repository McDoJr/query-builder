import { ALargeSmall, Calendar, Hash } from "lucide-react";

const icons = {
  text: ALargeSmall,
  number: Hash,
  date: Calendar,
};

export function getIcon(inputType: string) {
  return icons[inputType as keyof typeof icons] ?? icons.text;
}
