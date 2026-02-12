// Indian States and their major cities
export const INDIAN_REGIONS = [
    {
        name: "Delhi",
        cities: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
        coordinates: [28.7041, 77.1025]
    },
    {
        name: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
        coordinates: [19.0760, 72.8777]
    },
    {
        name: "Tamil Nadu",
        cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
        coordinates: [13.0827, 80.2707]
    },
    {
        name: "Karnataka",
        cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
        coordinates: [12.9716, 77.5946]
    },
    {
        name: "West Bengal",
        cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
        coordinates: [22.5726, 88.3639]
    },
    {
        name: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
        coordinates: [17.3850, 78.4867]
    },
    {
        name: "Gujarat",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        coordinates: [23.0225, 72.5714]
    },
    {
        name: "Rajasthan",
        cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
        coordinates: [26.9124, 75.7873]
    },
    {
        name: "Kerala",
        cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
        coordinates: [8.5241, 76.9366]
    },
    {
        name: "Andhra Pradesh",
        cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
        coordinates: [17.6868, 83.2185]
    },
    {
        name: "Uttar Pradesh",
        cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
        coordinates: [26.8467, 80.9462]
    },
    {
        name: "Punjab",
        cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
        coordinates: [30.7333, 76.7794]
    },
    {
        name: "Haryana",
        cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
        coordinates: [28.4595, 77.0266]
    },
    {
        name: "Bihar",
        cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
        coordinates: [25.5941, 85.1376]
    },
    {
        name: "Assam",
        cities: ["Guwahati", "Dispur", "Silchar", "Dibrugarh", "Jorhat"],
        coordinates: [26.1158, 91.7898]
    },
    {
        name: "Madhya Pradesh",
        cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
        coordinates: [23.2599, 77.4126]
    },
    {
        name: "Odisha",
        cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
        coordinates: [20.2961, 85.8245]
    },
    {
        name: "Jharkhand",
        cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
        coordinates: [23.3441, 85.3096]
    },
    {
        name: "Chhattisgarh",
        cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
        coordinates: [21.2514, 81.6296]
    },
    {
        name: "Uttarakhand",
        cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
        coordinates: [30.3165, 78.0322]
    },
    {
        name: "Himachal Pradesh",
        cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
        coordinates: [31.1048, 77.1734]
    },
    {
        name: "Jammu and Kashmir",
        cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
        coordinates: [34.0837, 74.7973]
    },
    {
        name: "Goa",
        cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
        coordinates: [15.2993, 74.1240]
    },
    {
        name: "Nagaland",
        cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
        coordinates: [25.6751, 94.1168]
    },
    {
        name: "Manipur",
        cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
        coordinates: [24.6637, 93.9063]
    },
    {
        name: "Meghalaya",
        cities: ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara"],
        coordinates: [25.5788, 91.8933]
    },
    {
        name: "Tripura",
        cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia"],
        coordinates: [23.8315, 91.2868]
    },
    {
        name: "Mizoram",
        cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
        coordinates: [23.7271, 92.7176]
    },
    {
        name: "Arunachal Pradesh",
        cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
        coordinates: [27.0844, 93.6053]
    },
    {
        name: "Sikkim",
        cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],
        coordinates: [27.3389, 88.6065]
    }
];

// Get cities for a specific region
export const getCitiesForRegion = (regionName) => {
    const region = INDIAN_REGIONS.find(r => r.name === regionName);
    return region ? region.cities : [];
};

// Get coordinates for a city
export const getCoordinatesForCity = (regionName, cityName) => {
    const region = INDIAN_REGIONS.find(r => r.name === regionName);
    if (!region) return null;

    // For now, return region coordinates
    // In a real app, you'd have city-specific coordinates
    return region.coordinates;
};
