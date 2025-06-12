export interface User {
	user_id: string;
	wallet_address: string;
	user_name: string;
	create_date: string; // ISO string
	charities?: Charity[];
	deposits?: Deposit[];
	donations?: Donation[];
	launchpads?: Launchpad[];
}

export interface Launchpad {
	launchpad_id: string;
	token_address: string;
	total_supply: number;
	launchpad_token: string;
	max_stake: number;
	min_stake: number;
	soft_cap: number;
	hard_cap: number;
	launchpad_name: string;
	launchpad_logo: string;
	launchpad_short_des: string;
	launchpad_long_des: string;
	launchpad_fb?: string;
	launchpad_x?: string;
	launchpad_ig?: string;
	launchpad_website?: string;
	launchpad_whitepaper?: string;
	launchpad_img: string[];
	launchpad_start_date: string; // ISO string
	launchpad_end_date: string; // ISO string
	project_owner_id: string;
	deposits?: Deposit[];
	status_launchpad?: "pending" | "approve" | "deny" | "publish";
	status?: "upcoming" | "ongoing" | "finished";
	totalInvest?: number;
	user?: User;
	price?: number; // Price per token in the launchpad
}

export interface Deposit {
	deposit_id: string;
	datetime: string; // ISO string
	amount: number;
	tx_hash?: string;
	user_id: string;
	launchpad_id: string;
	launchpad?: Launchpad;
	user?: User;
}

export interface Charity {
	charity_id: string;
	charity_name: string;
	charity_short_des: string;
	charity_long_des: string;
	charity_token_symbol: string;
	charity_logo: string;
	charity_fb?: string;
	charity_x?: string;
	charity_ig?: string;
	charity_website?: string;
	charity_whitepaper?: string;
	charity_img: string[];
	charity_start_date: string; // ISO string
	charity_end_date: string; // ISO string
	license_certificate?: string;
	evidence: string[];
	charity_email: string;
	repre_name: string;
	repre_phone: string;
	repre_id: string;
	repre_faceid: string;
	status: "pending" | "approve" | "deny" | "publish";
	user?: User;
	donations?: Donation[];
	totalDonationAmount?: number; // Total amount donated to this charity
}

export interface Donation {
	donate_id: string;
	amount: number;
	datetime: string; // ISO string
	tx_hash?: string;
	user_id: string;
	charity_id: string;
	charity?: Charity;
	user?: User;
}

export interface BaseProject {
	id?: string;
	name?: string;
	shortDescription?: string;
	longDescription?: string;
	logo?: string;
	images?: string[];
	startDate?: string;
	endDate?: string;
	facebook?: string;
	x?: string;
	instagram?: string;
	website?: string;
	whitepaper?: string;
	type?: "launchpad" | "charity";
	status?: "upcoming" | "ongoing" | "finished";
	price?: number;
	totalWithdraw?: number;

	//Launchpad
	token_address?: string;
	total_supply?: number;
	launchpad_token?: string;
	max_stake?: number;
	min_stake?: number;
	soft_cap?: number;
	hard_cap?: number;
	project_owner_id?: string;
	pricePerToken?: number;
	status_launchpad?: "pending" | "approve" | "deny" | "publish";
	totalInvest?: number;

	//Charity
	charity_token_symbol?: string;
	license_certificate?: string;
	evidence?: string[];
	repre_name?: string;
	repre_phone?: string;
	repre_id?: string;
	repre_faceid?: string;
	totalDonationAmount?: number;

	deposits?: Deposit[];
	donations?: Donation[];
	user?: User;
}
