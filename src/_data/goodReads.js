import Fetch from "@11ty/eleventy-fetch";
import { XMLParser } from "fast-xml-parser";

export default async function () {
	let url =
		"https://www.goodreads.com/review/list_rss/1665822?key=H39MSaWq7oSelYZqx5A8UxNiqfZWcfVKPJsJbi_xKLewsbTM&shelf=read";

	let feed = await Fetch(url, {
		duration: "1d",
		type: "text",
	});

	const parser = new XMLParser();
	let json = parser.parse(feed);

	let books = json.rss.channel.item;

	let mappedBooks = books.slice(0, 20).map((book) => {
		let mappedBook = {};
		mappedBook.title = book.title;
		mappedBook.author = book.author_name;
		mappedBook.image = book.book_large_image_url;
        mappedBook.dateRead = book.user_read_at;
        mappedBook.rating = book.user_rating;
		return mappedBook;
	});

	return mappedBooks;
}
