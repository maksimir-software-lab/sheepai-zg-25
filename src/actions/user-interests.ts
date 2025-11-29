"use server";

import { currentUser } from "@clerk/nextjs/server";
import { services } from "@/lib/services";

export const addUserInterest = async (interestText: string) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.userInterest.addInterest(user.id, interestText);
};

export const removeUserInterest = async (interestId: string) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.userInterest.removeInterest(user.id, interestId);
};

export const getUserInterests = async () => {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return services.userInterest.getInterests(user.id);
};
