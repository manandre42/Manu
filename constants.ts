import { MenuItem, RestaurantInfo } from './types';

export const CATEGORIES = ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'] as const;

export const INITIAL_RESTAURANT_INFO: RestaurantInfo = {
    name: "Sabor de Angola",
    phone: "+244 923 456 789",
    address: "Talatona, Luanda",
    wifiName: "Sabor_Cliente",
    wifiPassword: "bomapetite2024"
};

export const INITIAL_MENU: MenuItem[] = [
    {
        id: '1',
        name: 'Mufete Tradicional',
        description: 'Peixe carapau grelhado na brasa, acompanhado de feijão de óleo de palma, mandioca, batata doce e banana pão.',
        price: 8500,
        category: 'Pratos Principais',
        available: true,
        prepTime: 25,
        imageUrl: 'https://picsum.photos/id/431/600/400'
    },
    {
        id: '2',
        name: 'Calulu de Peixe',
        description: 'Tradicional calulu com peixe seco e fresco, quiabos e folhas de batata doce. Acompanha funge.',
        price: 9000,
        category: 'Pratos Principais',
        available: true,
        prepTime: 30,
        imageUrl: 'https://picsum.photos/id/292/600/400'
    },
    {
        id: '3',
        name: 'Kizaca',
        description: 'Folhas de mandioca pisadas, cozinhadas com amendoim e óleo de palma.',
        price: 4500,
        category: 'Entradas',
        available: true,
        isVegetarian: true,
        imageUrl: 'https://picsum.photos/id/1080/600/400'
    },
    {
        id: '4',
        name: 'Sumo de Múcua',
        description: 'Sumo natural feito da fruta do imbondeiro. Rico em vitamina C.',
        price: 1500,
        category: 'Bebidas',
        available: true,
        imageUrl: 'https://picsum.photos/id/430/600/400'
    },
    {
        id: '5',
        name: 'Mousse de Maracujá',
        description: 'Sobremesa cremosa e refrescante feita com polpa de maracujá fresco.',
        price: 2500,
        category: 'Sobremesas',
        available: true,
        imageUrl: 'https://picsum.photos/id/1060/600/400'
    },
     {
        id: '6',
        name: 'Cuca Preta',
        description: 'Cerveja nacional bem gelada.',
        price: 1000,
        category: 'Bebidas',
        available: true,
        imageUrl: 'https://picsum.photos/id/766/600/400'
    }
];