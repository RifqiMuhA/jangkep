/**
 * Data kutipan budaya Si Podo untuk kuliner Jawa Tengah.
 * Menggantikan kutipan generik "enak tenan!" dengan filosofi,
 * akulturasi budaya, cara memasak tradisional, dan keunikan lokal.
 */

export const CULTURAL_QUOTES: Record<string, string> = {
  // Semarang Raya
  'lumpia': 'Rebung manis renyah, wujud akulturasi Tionghoa-Jawa sing harmonis!',
  'lumpia-semarang': 'Rebung manis renyah, wujud akulturasi Tionghoa-Jawa sing harmonis!',
  'tahu-gimbal': 'Gimbal urang garing disiram petis legit, cita rasa pasisir Semarang!',
  'wingko-babat': 'Gurih kelapa enom panggang, oleh-oleh legendaris stasiun Tawang!',
  'tahu-petis': 'Tahu pong garing diseseli petis ireng, gurih legit nendang tenan!',
  'kue-lapis': 'Lapis kenyal suji pandan, ngemot piwulang sabar lan tlaten!',

  // Solo Raya
  'nasi-liwet': 'Santan areh gurih lan suwiran ayam, sajian kraton perlambang guyub rukun!',
  'nasi-liwet-solo': 'Santan areh gurih lan suwiran ayam, sajian kraton perlambang guyub rukun!',
  'serabi': 'Pinggiran renyah tengahe lumer, resep leluhur Solo wiwit taun 1923!',
  'serabi-notosuman': 'Pinggiran renyah tengahe lumer, resep leluhur Solo wiwit taun 1923!',
  'tengkleng': 'Olahan balungan rempah gulai, bukti cerdike leluhur ngolah rasa!',
  'tengkleng-solo': 'Olahan balungan rempah gulai, bukti cerdike leluhur ngolah rasa!',
  'sate-buntel': 'Cincangan daging kambing buntel lemak, empuk juicy bumbu kraton!',
  'tongseng': 'Gulai kambing kecap manis rempah, seger gurih kubis lan tomat anget!',
  'lemper': 'Ketan gurih pulen isi ayam, lambang paseduluran rukun sing rumaket!',
  'bakpao': 'Kue Moho mekar merekah, lambang rejeki akulturasi pasar lawas Solo!',
  'bakso': 'Kaldu bening balungan sapi mentah, lambang ulete perantau Wonogiri!',
  'bakso-wonogiri': 'Kaldu bening balungan sapi mentah, lambang ulete perantau Wonogiri!',

  // Pantura & Muria
  'soto': 'Daging kebo mangkok cilik, warisan toleransi luhur Sunan Kudus!',
  'soto-kudus': 'Daging kebo mangkok cilik, warisan toleransi luhur Sunan Kudus!',
  'jenang-kudus': 'Jenang pulen manis legit, pralambang gotong royong warga Kudus!',
  'garang-asem': 'Kukusan godhong gedhang blimbing wuluh, pedhes seger khas Kota Wali Demak!',
  'garang-asem-ayam': 'Kukusan godhong gedhang blimbing wuluh, pedhes seger khas Kota Wali Demak!',
  'nasi-gandul': 'Piring godhong gedhang kuah rempah gulai, tradisi mangan nganggo suru!',
  'nasi-gandul-pati': 'Piring godhong gedhang kuah rempah gulai, tradisi mangan nganggo suru!',
  'es-gempol': 'Kenyal gempol pleret santan gurih, segere pasisir Jepara ngresep ing ati!',
  'es-gempol-pleret': 'Kenyal gempol pleret santan gurih, segere pasisir Jepara ngresep ing ati!',
  'sate': 'Bumbu kacange lembut medok, arume panggangan areng kayu jati Blora!',
  'sate-ayam-blora': 'Bumbu kacange lembut medok, arume panggangan areng kayu jati Blora!',
  'sate-blora': 'Bumbu kacange lembut medok, arume panggangan areng kayu jati Blora!',
  'nasi-grombyang': 'Kuah kluwek ireng gurih ngresep, pusaka pesisir jalur legendaris Daendels!',
  'nasi-grombyang-pemalang': 'Kuah kluwek ireng gurih ngresep, pusaka pesisir jalur legendaris Daendels!',

  // Kedu & Banyumas
  'mie-ongklok': 'Kuah kental ebi lan godhong kucai, anget mantep neng hawa adhem Dieng!',
  'mie-ongklok-wonosobo': 'Kuah kental ebi lan godhong kucai, anget mantep neng hawa adhem Dieng!',
  'carica': 'Woh khas pegunungan Dieng, seger legi asem mung thukul neng tanah vulkanik!',
  'manisan-carica': 'Woh khas pegunungan Dieng, seger legi asem mung thukul neng tanah vulkanik!',
  'jajanan-pasar': 'Manis pulen parutan klapa, bukti singkong prasaja dadi pusaka rasa!',
  'getuk-lindri': 'Manis pulen parutan klapa, bukti singkong prasaja dadi pusaka rasa!',
  'kupat-tahu': 'Tahu bakwan renyah kuah kacang gula jawa, seger gurih khas Magelang!',
  'mangut-lele': 'Lele asep kayu bakar santen pedhes, aroma sangit khas lereng Merapi!',
  'tempe-goreng': 'Mendo anget cocol kecap rawit, ngreketi paseduluran khas Banyumas!',
  'tempe-mendoan': 'Mendo anget cocol kecap rawit, ngreketi paseduluran khas Banyumas!',
  'dawet-ayu': 'Cendol ijo pandan santan aren murni, seger maknyus khas Banjarnegara!',
  'dawet-ayu-banjarnegara': 'Cendol ijo pandan santan aren murni, seger maknyus khas Banjarnegara!'
};

export interface FoodQuoteInput {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  origin?: string;
  city?: string;
  tasteProfile?: string;
  category?: string;
}

/**
 * Mengambil kutipan budaya Si Podo yang kontekstual dan mendalam.
 */
export function getCulturalQuote(food?: FoodQuoteInput | null): string {
  if (!food) {
    return 'Kuliner Jawa Tengah, sugih rasa lan kebak crita warisan leluhur!';
  }

  const keyCandidates = [
    food.slug,
    food.id,
    food.name?.toLowerCase().replace(/\s+/g, '-'),
    food.title?.toLowerCase().replace(/\s+/g, '-'),
  ].filter(Boolean) as string[];

  // 1. Cek kecocokan kunci langsung
  for (const key of keyCandidates) {
    if (CULTURAL_QUOTES[key]) {
      return CULTURAL_QUOTES[key];
    }
    // Cek partial key
    for (const [dictKey, quote] of Object.entries(CULTURAL_QUOTES)) {
      if (key.includes(dictKey) || dictKey.includes(key)) {
        return quote;
      }
    }
  }

  // 2. Cek kecocokan nama teks
  const fullName = (food.name || food.title || '').toLowerCase();
  if (fullName.includes('lumpia')) return CULTURAL_QUOTES['lumpia'];
  if (fullName.includes('liwet')) return CULTURAL_QUOTES['nasi-liwet'];
  if (fullName.includes('soto')) return CULTURAL_QUOTES['soto'];
  if (fullName.includes('mendoan') || fullName.includes('tempe')) return CULTURAL_QUOTES['tempe-mendoan'];
  if (fullName.includes('sate') && fullName.includes('blora')) return CULTURAL_QUOTES['sate-blora'];
  if (fullName.includes('buntel')) return CULTURAL_QUOTES['sate-buntel'];
  if (fullName.includes('grombyang')) return CULTURAL_QUOTES['nasi-grombyang'];
  if (fullName.includes('ongklok')) return CULTURAL_QUOTES['mie-ongklok'];
  if (fullName.includes('gandul')) return CULTURAL_QUOTES['nasi-gandul'];
  if (fullName.includes('garang asem')) return CULTURAL_QUOTES['garang-asem'];
  if (fullName.includes('serabi')) return CULTURAL_QUOTES['serabi'];
  if (fullName.includes('tengkleng')) return CULTURAL_QUOTES['tengkleng'];
  if (fullName.includes('bakso')) return CULTURAL_QUOTES['bakso'];
  if (fullName.includes('dawet')) return CULTURAL_QUOTES['dawet-ayu'];
  if (fullName.includes('wingko')) return CULTURAL_QUOTES['wingko-babat'];
  if (fullName.includes('petis')) return CULTURAL_QUOTES['tahu-petis'];
  if (fullName.includes('gimbal')) return CULTURAL_QUOTES['tahu-gimbal'];
  if (fullName.includes('mangut')) return CULTURAL_QUOTES['mangut-lele'];
  if (fullName.includes('carica')) return CULTURAL_QUOTES['carica'];
  if (fullName.includes('gempol')) return CULTURAL_QUOTES['es-gempol'];
  if (fullName.includes('getuk')) return CULTURAL_QUOTES['getuk-lindri'];
  if (fullName.includes('kupat tahu')) return CULTURAL_QUOTES['kupat-tahu'];
  if (fullName.includes('tongseng')) return CULTURAL_QUOTES['tongseng'];

  // 3. Fallback dinamis berdasarkan daerah & profil rasa (tetap berakar pada budaya, bukan "enak tenan")
  const displayName = food.name || food.title || 'Kuliner iki';
  const kota = food.origin || food.city || 'Jawa Tengah';
  const rasa = food.tasteProfile?.toLowerCase() || '';

  if (rasa.includes('manis')) {
    return `${displayName}, manis legit warisan ${kota} sing ngresep ing ati!`;
  }
  if (rasa.includes('pedas') || rasa.includes('hangat')) {
    return `${displayName}, racikan bumbu pedhes anget rempah asli ${kota}!`;
  }
  if (rasa.includes('segar')) {
    return `${displayName}, seger sumyah kuah kaldu rempah khas ${kota}!`;
  }
  return `${displayName}, olahan bumbu rempah otentik ${kota} turun-temurun!`;
}
