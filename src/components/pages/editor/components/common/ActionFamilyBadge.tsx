import { Badge } from "@radix-ui/themes";
import { colorOf } from "../../utils/actionFamilies";
export function ActionFamilyBadge({ name }: { name: string }) {
  return (
    <Badge color={colorOf(name)} size="1">
      {name}
    </Badge>
  );
}
