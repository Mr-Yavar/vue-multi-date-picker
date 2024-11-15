import { ComponentMap } from "@/constants/ComponentMap";
import { ComponentType } from "../types";

export function configure(type: ComponentType) : (string|number)[] {
  return ComponentMap["ONE_DATE"]["DAY"];
}
