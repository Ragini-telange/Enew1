// ============================================
// GREENREWARD — PLANT DATA (30 plants)
// To add photos: put images in public/plant-photos/
// Name them: neem.jpg, mango.jpg, tulsi.jpg etc.
// ============================================

const PLANTS = [
  // ========== OUTDOOR ==========
  {
    name:'Neem', slug:'neem', sci:'Azadirachta indica', emoji:'🌳', cat:'outdoor',
    sun:'Full Sun', water:'Low', growth:'Fast', difficulty:'Easy',
    desc:'Native to India, drought-resistant with powerful medicinal properties. One of nature\'s most versatile trees found across the subcontinent.',
    care:'Requires minimal watering once established. Prefers full sun and well-drained soil. Prune annually to shape.',
    benefits:'Air purification, natural pesticide, dental care, skin treatment, soil improvement, shade.',
    hi_name:'नीम', mr_name:'निंब'
  },
  {
    name:'Mango', slug:'mango', sci:'Mangifera indica', emoji:'🥭', cat:'outdoor',
    sun:'Full Sun', water:'Moderate', growth:'Medium', difficulty:'Medium',
    desc:'India\'s national fruit tree — tropical, beloved, and deeply woven into culture. Produces the king of fruits.',
    care:'Water deeply but infrequently. Full sunlight essential. Prune after fruiting. Fertilize in early spring.',
    benefits:'Delicious fruit, shade, economic value, vitamins A & C, supports pollinators.',
    hi_name:'आम', mr_name:'आंबा'
  },
  {
    name:'Banyan', slug:'banyan', sci:'Ficus benghalensis', emoji:'🌲', cat:'outdoor',
    sun:'Full Sun', water:'Moderate', growth:'Slow', difficulty:'Easy',
    desc:'India\'s national tree — a living monument with magnificent aerial roots that can grow into a forest over centuries.',
    care:'Water moderately. Needs ample space and full sun. Prune aerial roots if needed for shape.',
    benefits:'Massive shade, air purification, cultural significance, habitat for birds and insects.',
    hi_name:'बरगद', mr_name:'वड'
  },
  {
    name:'Peepal', slug:'peepal', sci:'Ficus religiosa', emoji:'🍃', cat:'outdoor',
    sun:'Full Sun', water:'Low', growth:'Medium', difficulty:'Easy',
    desc:'Sacred tree that releases oxygen even at night. Revered in Buddhism, Hinduism, and Jainism.',
    care:'Water during dry spells. Tolerates partial shade. Prune occasionally to maintain size.',
    benefits:'24-hour oxygen, spiritual significance, medicinal bark, habitat for wildlife.',
    hi_name:'पीपल', mr_name:'पिंपळ'
  },
  {
    name:'Gulmohar', slug:'gulmohar', sci:'Delonix regia', emoji:'🌺', cat:'outdoor',
    sun:'Full Sun', water:'Low', growth:'Fast', difficulty:'Easy',
    desc:'Flame of the Forest — spectacular scarlet flowers paint cityscapes every summer.',
    care:'Water regularly but avoid waterlogging. Full sun. Prune after flowering season.',
    benefits:'Spectacular flowering, excellent shade, drought tolerant, urban beautification.',
    hi_name:'गुलमोहर', mr_name:'गुलमोहर'
  },
  {
    name:'Curry Leaf', slug:'curry-leaf', sci:'Murraya koenigii', emoji:'🌿', cat:'outdoor',
    sun:'Full Sun', water:'Moderate', growth:'Medium', difficulty:'Easy',
    desc:'The kitchen essential of Indian cooking — aromatic leaves used daily in South and West Indian cuisine.',
    care:'Water regularly. Full sun. Pinch tips to encourage bushiness. Feed monthly with organic fertilizer.',
    benefits:'Culinary staple, aids digestion, antioxidant rich, hair care, diabetes management.',
    hi_name:'करी पत्ता', mr_name:'कढीपत्ता'
  },
  {
    name:'Ashoka', slug:'ashoka', sci:'Saraca asoca', emoji:'🌸', cat:'outdoor',
    sun:'Partial Shade', water:'Moderate', growth:'Slow', difficulty:'Medium',
    desc:'Sacred and ornamental — dense green foliage with brilliant orange-red flowers.',
    care:'Prefers partial shade. Water regularly. Tolerates various soils. Minimal pruning needed.',
    benefits:'Ornamental beauty, medicinal bark, air purification, spiritual significance, shade.',
    hi_name:'अशोक', mr_name:'अशोका'
  },
  {
    name:'Jackfruit', slug:'jackfruit', sci:'Artocarpus heterophyllus', emoji:'🍈', cat:'outdoor',
    sun:'Full Sun', water:'Moderate', growth:'Medium', difficulty:'Easy',
    desc:'The world\'s largest tree-borne fruit — nutritious, versatile, and deeply rooted in Indian cuisine.',
    care:'Water deeply but allow soil to dry between waterings. Full sun. Well-draining soil essential.',
    benefits:'Enormous nutritious fruit, protein-rich, timber, shade, economic value.',
    hi_name:'कटहल', mr_name:'फणस'
  },
  {
    name:'Tamarind', slug:'tamarind', sci:'Tamarindus indica', emoji:'🟤', cat:'outdoor',
    sun:'Full Sun', water:'Low', growth:'Slow', difficulty:'Easy',
    desc:'The souring agent of Indian cuisine — ancient tree with tangy pods used in cooking and medicine.',
    care:'Extremely drought tolerant once established. Full sun. Well-drained soil. Minimal care.',
    benefits:'Culinary use, vitamin C, digestive health, shade, timber, traditional medicine.',
    hi_name:'इमली', mr_name:'चिंच'
  },
  {
    name:'Coconut', slug:'coconut', sci:'Cocos nucifera', emoji:'🥥', cat:'outdoor',
    sun:'Full Sun', water:'High', growth:'Medium', difficulty:'Medium',
    desc:'The tree of life — every part is useful. Quintessential to coastal India.',
    care:'Needs plenty of water and full sun. Coastal or humid climates ideal. Sandy soil preferred.',
    benefits:'Coconut water, oil, flesh, coir fiber, timber, traditional medicine.',
    hi_name:'नारियल', mr_name:'नारळ'
  },

  // ========== INDOOR ==========
  {
    name:'Aloe Vera', slug:'aloe-vera', sci:'Aloe barbadensis', emoji:'🌵', cat:'indoor',
    sun:'Indirect Light', water:'Very Low', growth:'Slow', difficulty:'Very Easy',
    desc:'A succulent powerhouse for healing gel. Extremely low maintenance — perfect for beginners.',
    care:'Water once every 2-3 weeks. Indirect sunlight. Very well-drained soil. Never overwater.',
    benefits:'Skin healing, burn treatment, hair care, air purification, digestive benefits.',
    hi_name:'एलोवेरा', mr_name:'कोरफड'
  },
  {
    name:'Spider Plant', slug:'spider-plant', sci:'Chlorophytum comosum', emoji:'🌱', cat:'indoor',
    sun:'Indirect Light', water:'Moderate', growth:'Fast', difficulty:'Very Easy',
    desc:'NASA-certified top air purifier. Produces beautiful hanging baby plants.',
    care:'Water moderately. Indirect sunlight. Repot when rootbound. Very forgiving plant.',
    benefits:'Removes formaldehyde & xylene, easy propagation, pet-friendly, improves air quality.',
    hi_name:'स्पाइडर प्लांट', mr_name:'स्पायडर प्लांट'
  },
  {
    name:'Peace Lily', slug:'peace-lily', sci:'Spathiphyllum wallisii', emoji:'🌼', cat:'indoor',
    sun:'Low Light', water:'Moderate', growth:'Medium', difficulty:'Easy',
    desc:'Elegant white flowers thriving in low-light — top choice for offices and shaded rooms.',
    care:'Keep soil moist but not soggy. Water when top inch dries. Mist leaves weekly.',
    benefits:'Removes benzene & ammonia, aesthetic beauty, thrives in shade, long blooming.',
    hi_name:'पीस लिली', mr_name:'पीस लिली'
  },
  {
    name:'Monstera', slug:'monstera', sci:'Monstera deliciosa', emoji:'🌿', cat:'indoor',
    sun:'Indirect Light', water:'Moderate', growth:'Medium', difficulty:'Easy',
    desc:'The iconic Swiss cheese plant with dramatic split leaves. Ultimate statement plant.',
    care:'Water when top 2 inches dry. Bright indirect light. Wipe leaves monthly.',
    benefits:'Air purification, dramatic visual impact, relatively low maintenance.',
    hi_name:'मोन्स्टेरा', mr_name:'मोन्स्टेरा'
  },
  {
    name:'Snake Plant', slug:'snake-plant', sci:'Sansevieria trifasciata', emoji:'🗡️', cat:'indoor',
    sun:'Low to Indirect', water:'Very Low', growth:'Slow', difficulty:'Very Easy',
    desc:'Nearly indestructible — thrives on neglect. Best bedroom plant, releasing oxygen at night.',
    care:'Water every 3-4 weeks. Tolerates any light. Avoid cold drafts. Extremely drought tolerant.',
    benefits:'Night oxygen release, removes toxins, very low maintenance, air purification.',
    hi_name:'स्नेक प्लांट', mr_name:'स्नेक प्लांट'
  },
  {
    name:'Pothos', slug:'pothos', sci:'Epipremnum aureum', emoji:'🪴', cat:'indoor',
    sun:'Low to Indirect', water:'Low', growth:'Fast', difficulty:'Very Easy',
    desc:'The ultimate beginner plant — trails beautifully, nearly impossible to kill.',
    care:'Water when soil is dry. Tolerates low light. Trim vines to encourage bushiness.',
    benefits:'Air purification, easy care, propagates freely, suits any room.',
    hi_name:'मनी प्लांट', mr_name:'मनी प्लांट'
  },
  {
    name:'Rubber Plant', slug:'rubber-plant', sci:'Ficus elastica', emoji:'🌳', cat:'indoor',
    sun:'Indirect Light', water:'Low', growth:'Medium', difficulty:'Easy',
    desc:'Bold, dramatic — large glossy leaves create a striking focal point in any interior.',
    care:'Water when top inch of soil dries. Bright indirect light. Wipe leaves monthly.',
    benefits:'Air purification, bold visual presence, long-lived, tolerates some neglect.',
    hi_name:'रबर प्लांट', mr_name:'रबर प्लांट'
  },
  {
    name:'ZZ Plant', slug:'zz-plant', sci:'Zamioculcas zamiifolia', emoji:'🪴', cat:'indoor',
    sun:'Low Light', water:'Very Low', growth:'Slow', difficulty:'Very Easy',
    desc:'Office superstar — thrives under fluorescent lights, tolerates weeks without water.',
    care:'Water every 2-3 weeks. Tolerates very low light. Does not like overwatering.',
    benefits:'Extremely low maintenance, air purification, perfect for offices.',
    hi_name:'ZZ प्लांट', mr_name:'ZZ प्लांट'
  },

  // ========== MEDICINAL ==========
  {
    name:'Tulsi', slug:'tulsi', sci:'Ocimum tenuiflorum', emoji:'🌿', cat:'medicinal',
    sun:'Full Sun', water:'Moderate', growth:'Fast', difficulty:'Easy',
    desc:'Holy Basil — India\'s most revered medicinal plant. Worshipped for 3,000+ years.',
    care:'Full sunlight required. Regular watering. Pinch flower buds to encourage leaf growth.',
    benefits:'Immunity booster, stress relief, respiratory health, anti-bacterial.',
    hi_name:'तुलसी', mr_name:'तुळस'
  },
  {
    name:'Ginger', slug:'ginger', sci:'Zingiber officinale', emoji:'🫚', cat:'medicinal',
    sun:'Partial Shade', water:'High', growth:'Medium', difficulty:'Medium',
    desc:'Root plant used in cooking and Ayurvedic medicine for thousands of years.',
    care:'Warm, humid conditions. Indirect sunlight. Water regularly without waterlogging.',
    benefits:'Digestive health, anti-inflammatory, nausea relief, immunity, culinary essential.',
    hi_name:'अदरक', mr_name:'आले'
  },
  {
    name:'Ashwagandha', slug:'ashwagandha', sci:'Withania somnifera', emoji:'🌾', cat:'medicinal',
    sun:'Full Sun', water:'Low', growth:'Medium', difficulty:'Easy',
    desc:'Indian Ginseng — the most famous Ayurvedic adaptogen for stress and vitality.',
    care:'Dry, sandy soil. Full sun. Water sparingly. Very drought tolerant once established.',
    benefits:'Stress relief, energy boost, better sleep, cognitive function, thyroid support.',
    hi_name:'अश्वगंधा', mr_name:'अश्वगंधा'
  },
  {
    name:'Giloy', slug:'giloy', sci:'Tinospora cordifolia', emoji:'🍀', cat:'medicinal',
    sun:'Partial Shade', water:'Moderate', growth:'Fast', difficulty:'Easy',
    desc:'Amrit of Ayurveda — extraordinary immune-boosting climbing shrub.',
    care:'Grows on a support. Moderate watering. Partial shade. Prune regularly.',
    benefits:'Immunity booster, fever reducer, anti-inflammatory, blood sugar regulation.',
    hi_name:'गिलोय', mr_name:'गुळवेल'
  },
  {
    name:'Lemon Grass', slug:'lemon-grass', sci:'Cymbopogon citratus', emoji:'🌾', cat:'medicinal',
    sun:'Full Sun', water:'Moderate', growth:'Fast', difficulty:'Very Easy',
    desc:'Fragrant citrusy grass used in tea, cooking, and natural mosquito control.',
    care:'Full sun. Water moderately. Divide clumps every 2-3 years. Great in pots.',
    benefits:'Anxiety relief, digestive aid, natural mosquito repellent, culinary use.',
    hi_name:'लेमन ग्रास', mr_name:'लेमन ग्रास'
  },
  {
    name:'Brahmi', slug:'brahmi', sci:'Bacopa monnieri', emoji:'🍃', cat:'medicinal',
    sun:'Partial Shade', water:'High', growth:'Fast', difficulty:'Medium',
    desc:'The brain herb of Ayurveda — enhances memory and reduces anxiety for centuries.',
    care:'Loves moisture. Partial shade. Water frequently. Can grow in waterlogged conditions.',
    benefits:'Memory enhancement, concentration, anxiety relief, hair growth.',
    hi_name:'ब्राह्मी', mr_name:'ब्राह्मी'
  },
  {
    name:'Moringa', slug:'moringa', sci:'Moringa oleifera', emoji:'🌻', cat:'medicinal',
    sun:'Full Sun', water:'Low', growth:'Very Fast', difficulty:'Very Easy',
    desc:'The miracle tree — most nutritious leaves on earth. Every part is edible and medicinal.',
    care:'Full sun. Drought tolerant. Minimal water needed. Grows extremely fast from seed.',
    benefits:'Superfood leaves, all amino acids, anti-inflammatory, diabetes management.',
    hi_name:'मोरिंगा', mr_name:'शेवगा'
  },

  // ========== SHOWCASE ==========
  {
    name:'Rose', slug:'rose', sci:'Rosa hybrida', emoji:'🌹', cat:'showcase',
    sun:'Full Sun', water:'Moderate', growth:'Medium', difficulty:'Medium',
    desc:'The queen of flowers — beloved worldwide for fragrance, beauty, and romantic symbolism.',
    care:'Full sunlight. Regular watering. Well-drained soil. Prune in winter. Watch for aphids.',
    benefits:'Fragrance, beauty, rose water production, culinary use, attracts pollinators.',
    hi_name:'गुलाब', mr_name:'गुलाब'
  },
  {
    name:'Orchid', slug:'orchid', sci:'Orchidaceae', emoji:'🌸', cat:'showcase',
    sun:'Indirect Light', water:'Low', growth:'Slow', difficulty:'Hard',
    desc:'Exotic and elegant with thousands of varieties. Symbol of luxury and rarity.',
    care:'Indirect sunlight. Water every 7-10 days. Good humidity. Orchid fertilizer monthly.',
    benefits:'Aesthetic beauty, air purification, long bloom duration (months).',
    hi_name:'ऑर्किड', mr_name:'ऑर्किड'
  },
  {
    name:'Sunflower', slug:'sunflower', sci:'Helianthus annuus', emoji:'🌻', cat:'showcase',
    sun:'Full Sun', water:'Moderate', growth:'Very Fast', difficulty:'Very Easy',
    desc:'The happiest flower — follows the sun, produces edible seeds, brings instant joy.',
    care:'Plant in full sun. Water at base. Support tall varieties. Harvest when back turns brown.',
    benefits:'Edible seeds, oil production, bird food, brightens spaces, attracts bees.',
    hi_name:'सूरजमुखी', mr_name:'सूर्यफूल'
  },
  {
    name:'Marigold', slug:'marigold', sci:'Tagetes erecta', emoji:'🟠', cat:'showcase',
    sun:'Full Sun', water:'Low', growth:'Fast', difficulty:'Very Easy',
    desc:'India\'s festival flower — vibrant orange-yellow blooms for weddings and pujas.',
    care:'Water sparingly. Full sun. Deadhead regularly for more blooms. Very easy from seed.',
    benefits:'Festival decoration, natural pest repellent, companion planting, dye production.',
    hi_name:'गेंदा', mr_name:'झेंडू'
  },
  {
    name:'Bougainvillea', slug:'bougainvillea', sci:'Bougainvillea spectabilis', emoji:'🌺', cat:'showcase',
    sun:'Full Sun', water:'Low', growth:'Fast', difficulty:'Easy',
    desc:'The queen of climbers — impossibly vibrant bracts in pink, purple, and orange.',
    care:'Full sun essential. Water sparingly — drought stress triggers flowering. Prune hard after bloom.',
    benefits:'Stunning flowering, drought tolerant, privacy screening, attracts butterflies.',
    hi_name:'बोगनवेलिया', mr_name:'बोगनवेलिया'
  },
];

// ===== ORGANIZATIONS =====
const ORGS = [
  { id:1, name:'Green Yatra', logo:'🌍', verified:true, desc:'India\'s leading environmental organization focused on urban tree plantation across 30 cities.', count:'12,450 trees planted', xpReward:60 },
  { id:2, name:'Sankalp Taru', logo:'🌳', verified:true, desc:'Technology-enabled tree plantation with individual tracking and satellite monitoring.', count:'8,200 trees planted', xpReward:55 },
  { id:3, name:'Grow-Trees', logo:'🌱', verified:true, desc:'Online platform connecting donors with tribal communities to plant trees across rural India.', count:'25,000 trees planted', xpReward:70 },
  { id:4, name:'Save Green India', logo:'🌿', verified:true, desc:'NGO working on reforestation of degraded forest lands in Maharashtra, Karnataka, and Telangana.', count:'6,100 trees planted', xpReward:50 },
];

// ===== REWARDS =====
const REWARDS = [
  { name:'First Sapling', pts:0,    emoji:'🌱', desc:'Welcome to GreenReward!' },
  { name:'Green Thumb',   pts:100,  emoji:'👍', desc:'Reach 100 points' },
  { name:'Photo Pro',     pts:200,  emoji:'📸', desc:'Upload 5 growth photos' },
  { name:'Tree Guardian', pts:500,  emoji:'🛡️', desc:'Reach 500 points' },
  { name:'Eco Warrior',   pts:800,  emoji:'⚔️', desc:'Reach 800 points' },
  { name:'Nature Champ',  pts:1000, emoji:'🏆', desc:'1000 pts — gift eligible!' },
  { name:'Earth Hero',    pts:2000, emoji:'🌍', desc:'2000 pts — certificate!' },
];
