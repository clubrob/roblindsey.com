import { program } from "commander";
import { select } from "@inquirer/prompts";
import { fileURLToPath } from "url";
import { dirname } from "node:path";
import createNote from "./commands/createNote.js";
import createPost from "./commands/createPost.js";

const siteRoot = dirname(fileURLToPath(import.meta.url)).replace("/cli", "");

const runProgram = async () => {
	const type = await select({
		message: "What do you want to do?",
		choices: [
			{
				name: "Create a new post",
				value: "post",
				description: "Create a new post",
			},
			{
				name: "Create a new note",
				value: "note",
				description: "Create a new note",
			},
		],
	});

	switch (type) {
		case "post":
			createPost(siteRoot);
			break;
		case "note":
			createNote(siteRoot);
			break;
	}
};

program
	.command("run")
	.description("Run the site wizard")
	.action(() => runProgram());
program
	.command("post")
	.description("Create a new post")
	.action(() => createPost(siteRoot));
program
	.command("note")
	.description("Create a new note")
	.action(() => createNote(siteRoot));

program.parse();
