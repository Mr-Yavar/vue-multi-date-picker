import { ComponentMap } from "@/constants/ComponentMap";
import { ComponentType } from "../types";

export function configure(type: ComponentType) {
  return ComponentMap["DATE"]["YEAR"];
}
