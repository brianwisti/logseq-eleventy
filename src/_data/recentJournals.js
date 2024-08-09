// Just the journal pages
import journals from "./journals.js";

export default function () {
  return journals().slice(0, 5);
};
