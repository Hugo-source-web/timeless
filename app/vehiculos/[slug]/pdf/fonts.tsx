import { Font } from "@react-pdf/renderer";
import path from "path";

Font.register({
  family: "Timeless",
  src: path.resolve("./app/fonts/EurostileExtendedBlack.woff"),
});
