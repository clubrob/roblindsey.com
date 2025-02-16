export default async (request) => {
	const ua = request.headers.get("user-agent");
	const uaList = ["Mastodon", "Bridgy", "Friendica", "Pleroma"];

	console.log(`Received request with User-Agent: ${ua}`);

	if (!ua) {
		console.log("No User-Agent found, continuing request");
		return;
	}

	const lowerUA = ua.toLowerCase();
	if (uaList.some((u) => lowerUA.includes(u.toLowerCase()))) {
		console.log(`Blocked request from ${ua}`);
		return new Response(null, { status: 204 });
	}

	// if (uaList.some((u) => u.includes(ua))) {
	// 	return new Response(null, {
	// 		status: 204,
	// 	});
	// }
	console.log("Request allowed to continue");
};

export const config = {
	onError: "bypass",
	path: ["/notes/*"],
};
