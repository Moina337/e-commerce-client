import { Product } from '../shared/models/product.model';

export const mockProducts: Product[] = [
	{
		id: 1,
		name: 'Casque audio sans fil',
		slug: 'casque-audio-sans-fil',
		description:
			'Casque Bluetooth confortable avec réduction de bruit et autonomie longue durée.',
		price: 129.9,
		stockQuantity: 24,
		images: [
			{
				id: 1,
				originalFilename: 'casque-audio.jpg',
				contentType: 'image/jpeg',
				size: 184320,
				url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-09-12T10:30:00.000Z',
			},
		],
		category: { id: 1, name: 'Électronique', slug: 'electronique' },
		createdAt: '2026-09-12T10:30:00.000Z',
		updatedAt: '2026-10-02T14:15:00.000Z',
	},
	{
		id: 2,
		name: 'Montre connectée Active',
		slug: 'montre-connectee-active',
		description:
			'Montre légère avec suivi de l’activité, notifications et résistance à l’eau.',
		price: 89.5,
		stockQuantity: 8,
		images: [
			{
				id: 2,
				originalFilename: 'montre-connectee.jpg',
				contentType: 'image/jpeg',
				size: 201728,
				url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-09-18T09:00:00.000Z',
			},
		],
		category: { id: 1, name: 'Électronique', slug: 'electronique' },
		createdAt: '2026-09-18T09:00:00.000Z',
		updatedAt: '2026-09-18T09:00:00.000Z',
	},
	{
		id: 3,
		name: 'Sac à dos urbain',
		slug: 'sac-a-dos-urbain',
		description:
			'Sac résistant avec compartiment ordinateur et poches pratiques pour le quotidien.',
		price: 64,
		stockQuantity: 0,
		images: [
			{
				id: 3,
				originalFilename: 'sac-a-dos.jpg',
				contentType: 'image/jpeg',
				size: 172032,
				url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-09-20T11:20:00.000Z',
			},
		],
		category: { id: 2, name: 'Accessoires', slug: 'accessoires' },
		createdAt: '2026-09-20T11:20:00.000Z',
		updatedAt: '2026-10-08T16:45:00.000Z',
	},
	{
		id: 4,
		name: 'Lampe de bureau articulée',
		slug: 'lampe-de-bureau-articulee',
		description:
			'Lampe orientable au design sobre, idéale pour un espace de travail ou de lecture.',
		price: 42.9,
		stockQuantity: 17,
		images: [
			{
				id: 4,
				originalFilename: 'lampe-bureau.jpg',
				contentType: 'image/jpeg',
				size: 163840,
				url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-09-24T08:10:00.000Z',
			},
		],
		category: { id: 3, name: 'Maison', slug: 'maison' },
		createdAt: '2026-09-24T08:10:00.000Z',
		updatedAt: '2026-09-24T08:10:00.000Z',
	},
	{
		id: 5,
		name: 'Baskets Essential',
		slug: 'baskets-essential',
		description:
			'Baskets polyvalentes au profil classique, conçues pour être portées tous les jours.',
		price: 74.9,
		stockQuantity: 31,
		images: [
			{
				id: 5,
				originalFilename: 'baskets-essential.jpg',
				contentType: 'image/jpeg',
				size: 196608,
				url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-10-01T13:00:00.000Z',
			},
		],
		category: { id: 4, name: 'Mode', slug: 'mode' },
		createdAt: '2026-10-01T13:00:00.000Z',
		updatedAt: '2026-10-10T10:25:00.000Z',
	},
	{
		id: 6,
		name: 'Gourde isotherme 750 ml',
		slug: 'gourde-isotherme-750-ml',
		description:
			'Gourde réutilisable à double paroi pour garder les boissons fraîches ou chaudes.',
		price: 24.9,
		stockQuantity: 42,
		images: [
			{
				id: 6,
				originalFilename: 'gourde-isotherme.jpg',
				contentType: 'image/jpeg',
				size: 155648,
				url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
				createdAt: '2026-10-05T15:40:00.000Z',
			},
		],
		category: { id: 5, name: 'Sport', slug: 'sport' },
		createdAt: '2026-10-05T15:40:00.000Z',
		updatedAt: '2026-10-05T15:40:00.000Z',
	},
];
