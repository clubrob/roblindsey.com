import dayjs from "dayjs";

export const filters = {
	dateForPath: (date) => {
		const postDate = new Date(date);
		return dayjs(postDate).format("YYYY-MM-DD").toString();
	},
	dateForBookshelf: (date) => {
		const bookDate = new Date(date);
		return dayjs(bookDate).format("M.D.YYYY").toString();
	},
	ratingToStars: (num) => {
		let stars = "";
		for (let i = 0; i < num; i++) {
			stars += "★";
		}
		return stars;
	},
	postDate: (date) => {
		const postDate = new Date(date);
		return dayjs(postDate).format("MMMM D, YYYY").toString();
	},
};
