export default async function (req) {
	const ua = req.headers.get("user-agent");
	const uaList = ["Mastodon", "Bridgy", "Friendica", "Pleroma"];

	if (!ua) {
		return;
	}

	if (uaList.some((u) => u.includes(ua))) {
		return new Response(null, {
			status: 204,
		});
	}
}

export const config = {
	onError: "bypass",
	path: ["/notes/*"],
};
