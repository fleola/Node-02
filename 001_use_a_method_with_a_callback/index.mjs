import { writeFile } from "node:fs";

writeFile("text-file.txt", "Hello, Jacopo!", (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log("Text File created!");
});
