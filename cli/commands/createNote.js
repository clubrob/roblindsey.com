import { input } from "@inquirer/prompts";
import fs from "fs";

export default async (siteRoot) => {
	const content = await input({ message: "Content" });

	const postDate = new Date().toISOString();
	const slugDay = postDate.split("T")[0];
	const slugTime = postDate.split("T")[1].slice(0, 8).replaceAll(":", "-");
	const slug = `${slugDay}-${slugTime}`.replaceAll("-", "");
	const year = new Date().getFullYear();

	// prettier-ignore
	const noteFileContents = `---
permalink: /notes/${slug}/index.html
date: ${postDate}
---

${content}
`;

	if (!fs.existsSync(`${siteRoot}/src/content/notes/${year}`)) {
		fs.mkdirSync(`${siteRoot}/src/content/notes/${year}`);
	}

	fs.writeFileSync(
		`${siteRoot}/src/content/notes/${year}/${slug}.md`,
		noteFileContents,
		{
			flag: "wx",
		}
	);
};
