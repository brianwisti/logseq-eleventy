// Just the journal pages
import journals from "./journals";

export default function () {
  return journals().slice(0, 5);
};
