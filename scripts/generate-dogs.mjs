import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = path.join(process.cwd(), "public", "assets", "dogs");

const outputFile = path.join(
	process.cwd(),
	"src",
	"components",
	"layout",
	"Dogs",
	"dogs.generated.ts",
);

const files = (await readdir(assetsDirectory))
	.filter((file) => /\.(png|jpe?g|webp|avif|gif)$/i.test(file))
	.sort();

const content = `const dogs = ${JSON.stringify(
	files.map((file) => `/assets/dogs/${file}`),
)} as const;

export default dogs;
`;

await writeFile(outputFile, content, "utf8");

console.log(`Generated list of ${files.length} dog images.`);
