import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type IconProps = React.ComponentProps<typeof Ionicons>;

export default function Icon(props: IconProps) {
  return <Ionicons numberOfLines={1} adjustsFontSizeToFit={true} {...props} />;
}
