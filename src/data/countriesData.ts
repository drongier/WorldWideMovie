import type { Country, Continent } from '../types';


export const INITIAL_COUNTRIES: Country[] = [
  // ================= EUROPE =================
  {
    code: 'AL',
    cca3: 'ALB',
    name: 'Albania',
    frenchName: 'Albanie',
    continent: 'Europe',
    flag: '🇦🇱',
    aliases: ['Albania', 'Albanie']
  },
  {
    code: 'DE',
    cca3: 'DEU',
    name: 'Germany',
    frenchName: 'Allemagne',
    continent: 'Europe',
    flag: '🇩🇪',
    aliases: ['Germany', 'Allemagne', 'West Germany', 'East Germany', 'Federal Republic of Germany', 'German Democratic Republic']
  },
  {
    code: 'AD',
    cca3: 'AND',
    name: 'Andorra',
    frenchName: 'Andorre',
    continent: 'Europe',
    flag: '🇦🇩',
    aliases: ['Andorra', 'Andorre']
  },
  {
    code: 'AT',
    cca3: 'AUT',
    name: 'Austria',
    frenchName: 'Autriche',
    continent: 'Europe',
    flag: '🇦🇹',
    aliases: ['Austria', 'Autriche', 'Austria-Hungary']
  },
  {
    code: 'BE',
    cca3: 'BEL',
    name: 'Belgium',
    frenchName: 'Belgique',
    continent: 'Europe',
    flag: '🇧🇪',
    aliases: ['Belgium', 'Belgique']
  },
  {
    code: 'BY',
    cca3: 'BLR',
    name: 'Belarus',
    frenchName: 'Biélorussie',
    continent: 'Europe',
    flag: '🇧🇾',
    aliases: ['Belarus', 'Bielorussie', 'Biélorussie', 'Byelorussia']
  },
  {
    code: 'BA',
    cca3: 'BIH',
    name: 'Bosnia and Herzegovina',
    frenchName: 'Bosnie-Herzégovine',
    continent: 'Europe',
    flag: '🇧🇦',
    aliases: ['Bosnia and Herzegovina', 'Bosnia-Herzegovina', 'Bosnie-Herzégovine', 'Bosnia']
  },
  {
    code: 'BG',
    cca3: 'BGR',
    name: 'Bulgaria',
    frenchName: 'Bulgarie',
    continent: 'Europe',
    flag: '🇧🇬',
    aliases: ['Bulgaria', 'Bulgarie']
  },
  {
    code: 'CY',
    cca3: 'CYP',
    name: 'Cyprus',
    frenchName: 'Chypre',
    continent: 'Europe',
    flag: '🇨🇾',
    aliases: ['Cyprus', 'Chypre']
  },
  {
    code: 'HR',
    cca3: 'HRV',
    name: 'Croatia',
    frenchName: 'Croatie',
    continent: 'Europe',
    flag: '🇭🇷',
    aliases: ['Croatia', 'Croatie']
  },
  {
    code: 'DK',
    cca3: 'DNK',
    name: 'Denmark',
    frenchName: 'Danemark',
    continent: 'Europe',
    flag: '🇩🇰',
    aliases: ['Denmark', 'Danemark', 'Greenland', 'Faroe Islands']
  },
  {
    code: 'ES',
    cca3: 'ESP',
    name: 'Spain',
    frenchName: 'Espagne',
    continent: 'Europe',
    flag: '🇪🇸',
    aliases: ['Spain', 'Espagne']
  },
  {
    code: 'EE',
    cca3: 'EST',
    name: 'Estonia',
    frenchName: 'Estonie',
    continent: 'Europe',
    flag: '🇪🇪',
    aliases: ['Estonia', 'Estonie']
  },
  {
    code: 'FI',
    cca3: 'FIN',
    name: 'Finland',
    frenchName: 'Finlande',
    continent: 'Europe',
    flag: '🇫🇮',
    aliases: ['Finland', 'Finlande']
  },
  {
    code: 'FR',
    cca3: 'FRA',
    name: 'France',
    frenchName: 'France',
    continent: 'Europe',
    flag: '🇫🇷',
    aliases: ['France', 'French Republic', 'Martinique', 'Guadeloupe', 'Réunion', 'Reunion', 'French Polynesia']
  },
  {
    code: 'GR',
    cca3: 'GRC',
    name: 'Greece',
    frenchName: 'Grèce',
    continent: 'Europe',
    flag: '🇬🇷',
    aliases: ['Greece', 'Grèce']
  },
  {
    code: 'HU',
    cca3: 'HUN',
    name: 'Hungary',
    frenchName: 'Hongrie',
    continent: 'Europe',
    flag: '🇭🇺',
    aliases: ['Hungary', 'Hongrie']
  },
  {
    code: 'IE',
    cca3: 'IRL',
    name: 'Ireland',
    frenchName: 'Irlande',
    continent: 'Europe',
    flag: '🇮🇪',
    aliases: ['Ireland', 'Republic of Ireland', 'Irlande']
  },
  {
    code: 'IS',
    cca3: 'ISL',
    name: 'Iceland',
    frenchName: 'Islande',
    continent: 'Europe',
    flag: '🇮🇸',
    aliases: ['Iceland', 'Islande']
  },
  {
    code: 'IT',
    cca3: 'ITA',
    name: 'Italy',
    frenchName: 'Italie',
    continent: 'Europe',
    flag: '🇮🇹',
    aliases: ['Italy', 'Italie']
  },
  {
    code: 'XK',
    cca3: 'XKX',
    name: 'Kosovo',
    frenchName: 'Kosovo',
    continent: 'Europe',
    flag: '🇽🇰',
    aliases: ['Kosovo']
  },
  {
    code: 'LV',
    cca3: 'LVA',
    name: 'Latvia',
    frenchName: 'Lettonie',
    continent: 'Europe',
    flag: '🇱🇻',
    aliases: ['Latvia', 'Lettonie']
  },
  {
    code: 'LI',
    cca3: 'LIE',
    name: 'Liechtenstein',
    frenchName: 'Liechtenstein',
    continent: 'Europe',
    flag: '🇱🇮',
    aliases: ['Liechtenstein']
  },
  {
    code: 'LT',
    cca3: 'LTU',
    name: 'Lithuania',
    frenchName: 'Lituanie',
    continent: 'Europe',
    flag: '🇱🇹',
    aliases: ['Lithuania', 'Lituanie']
  },
  {
    code: 'LU',
    cca3: 'LUX',
    name: 'Luxembourg',
    frenchName: 'Luxembourg',
    continent: 'Europe',
    flag: '🇱🇺',
    aliases: ['Luxembourg']
  },
  {
    code: 'MK',
    cca3: 'MKD',
    name: 'North Macedonia',
    frenchName: 'Macédoine du Nord',
    continent: 'Europe',
    flag: '🇲🇰',
    aliases: ['North Macedonia', 'Macedonia', 'Macédoine', 'FYROM', 'Macedonia, the former Yugoslav Republic of']
  },
  {
    code: 'MT',
    cca3: 'MLT',
    name: 'Malta',
    frenchName: 'Malte',
    continent: 'Europe',
    flag: '🇲🇹',
    aliases: ['Malta', 'Malte']
  },
  {
    code: 'MD',
    cca3: 'MDA',
    name: 'Moldova',
    frenchName: 'Moldavie',
    continent: 'Europe',
    flag: '🇲🇩',
    aliases: ['Moldova', 'Moldavie', 'Republic of Moldova']
  },
  {
    code: 'MC',
    cca3: 'MCO',
    name: 'Monaco',
    frenchName: 'Monaco',
    continent: 'Europe',
    flag: '🇲🇨',
    aliases: ['Monaco']
  },
  {
    code: 'ME',
    cca3: 'MNE',
    name: 'Montenegro',
    frenchName: 'Monténégro',
    continent: 'Europe',
    flag: '🇲🇪',
    aliases: ['Montenegro', 'Monténégro']
  },
  {
    code: 'NO',
    cca3: 'NOR',
    name: 'Norway',
    frenchName: 'Norvège',
    continent: 'Europe',
    flag: '🇳🇴',
    aliases: ['Norway', 'Norvège', 'Svalbard']
  },
  {
    code: 'NL',
    cca3: 'NLD',
    name: 'Netherlands',
    frenchName: 'Pays-Bas',
    continent: 'Europe',
    flag: '🇳🇱',
    aliases: ['Netherlands', 'The Netherlands', 'Pays-Bas', 'Holland', 'Curacao', 'Aruba']
  },
  {
    code: 'PL',
    cca3: 'POL',
    name: 'Poland',
    frenchName: 'Pologne',
    continent: 'Europe',
    flag: '🇵🇱',
    aliases: ['Poland', 'Pologne']
  },
  {
    code: 'PT',
    cca3: 'PRT',
    name: 'Portugal',
    frenchName: 'Portugal',
    continent: 'Europe',
    flag: '🇵🇹',
    aliases: ['Portugal']
  },
  {
    code: 'CZ',
    cca3: 'CZE',
    name: 'Czech Republic',
    frenchName: 'Tchéquie',
    continent: 'Europe',
    flag: '🇨🇿',
    aliases: ['Czech Republic', 'Czechia', 'Tchéquie', 'Czechoslovakia', 'Tchécoslovaquie']
  },
  {
    code: 'RO',
    cca3: 'ROU',
    name: 'Romania',
    frenchName: 'Roumanie',
    continent: 'Europe',
    flag: '🇷🇴',
    aliases: ['Romania', 'Roumanie']
  },
  {
    code: 'GB',
    cca3: 'GBR',
    name: 'United Kingdom',
    frenchName: 'Royaume-Uni',
    continent: 'Europe',
    flag: '🇬🇧',
    aliases: ['United Kingdom', 'UK', 'Great Britain', 'England', 'Scotland', 'Wales', 'Northern Ireland', 'Royaume-Uni', 'Angleterre', 'Ecosse']
  },
  {
    code: 'RU',
    cca3: 'RUS',
    name: 'Russia',
    frenchName: 'Russie',
    continent: 'Europe',
    flag: '🇷🇺',
    aliases: ['Russia', 'Russian Federation', 'Russie', 'Soviet Union', 'USSR', 'URSS']
  },
  {
    code: 'SM',
    cca3: 'SMR',
    name: 'San Marino',
    frenchName: 'Saint-Marin',
    continent: 'Europe',
    flag: '🇸🇲',
    aliases: ['San Marino', 'Saint-Marin']
  },
  {
    code: 'RS',
    cca3: 'SRB',
    name: 'Serbia',
    frenchName: 'Serbie',
    continent: 'Europe',
    flag: '🇷🇸',
    aliases: ['Serbia', 'Serbie', 'Yugoslavia', 'Yougoslavie', 'Serbia and Montenegro']
  },
  {
    code: 'SK',
    cca3: 'SVK',
    name: 'Slovakia',
    frenchName: 'Slovaquie',
    continent: 'Europe',
    flag: '🇸🇰',
    aliases: ['Slovakia', 'Slovaquie', 'Slovak Republic']
  },
  {
    code: 'SI',
    cca3: 'SVN',
    name: 'Slovenia',
    frenchName: 'Slovénie',
    continent: 'Europe',
    flag: '🇸🇮',
    aliases: ['Slovenia', 'Slovénie']
  },
  {
    code: 'SE',
    cca3: 'SWE',
    name: 'Sweden',
    frenchName: 'Suède',
    continent: 'Europe',
    flag: '🇸🇪',
    aliases: ['Sweden', 'Suède']
  },
  {
    code: 'CH',
    cca3: 'CHE',
    name: 'Switzerland',
    frenchName: 'Suisse',
    continent: 'Europe',
    flag: '🇨🇭',
    aliases: ['Switzerland', 'Suisse']
  },
  {
    code: 'UA',
    cca3: 'UKR',
    name: 'Ukraine',
    frenchName: 'Ukraine',
    continent: 'Europe',
    flag: '🇺🇦',
    aliases: ['Ukraine']
  },
  {
    code: 'VA',
    cca3: 'VAT',
    name: 'Vatican City',
    frenchName: 'Vatican',
    continent: 'Europe',
    flag: '🇻🇦',
    aliases: ['Vatican City', 'Vatican', 'Holy See']
  },

  // ================= ASIE =================
  {
    code: 'AF',
    cca3: 'AFG',
    name: 'Afghanistan',
    frenchName: 'Afghanistan',
    continent: 'Asie',
    flag: '🇦🇫',
    aliases: ['Afghanistan']
  },
  {
    code: 'SA',
    cca3: 'SAU',
    name: 'Saudi Arabia',
    frenchName: 'Arabie Saoudite',
    continent: 'Asie',
    flag: '🇸🇦',
    aliases: ['Saudi Arabia', 'Arabie Saoudite']
  },
  {
    code: 'AM',
    cca3: 'ARM',
    name: 'Armenia',
    frenchName: 'Arménie',
    continent: 'Asie',
    flag: '🇦🇲',
    aliases: ['Armenia', 'Arménie']
  },
  {
    code: 'AZ',
    cca3: 'AZE',
    name: 'Azerbaijan',
    frenchName: 'Azerbaïdjan',
    continent: 'Asie',
    flag: '🇦🇿',
    aliases: ['Azerbaijan', 'Azerbaïdjan', 'Azerbaidjan']
  },
  {
    code: 'BH',
    cca3: 'BHR',
    name: 'Bahrain',
    frenchName: 'Bahreïn',
    continent: 'Asie',
    flag: '🇧🇭',
    aliases: ['Bahrain', 'Bahrein', 'Bahreïn']
  },
  {
    code: 'BD',
    cca3: 'BGD',
    name: 'Bangladesh',
    frenchName: 'Bangladesh',
    continent: 'Asie',
    flag: '🇧🇩',
    aliases: ['Bangladesh']
  },
  {
    code: 'BT',
    cca3: 'BTN',
    name: 'Bhutan',
    frenchName: 'Bhoutan',
    continent: 'Asie',
    flag: '🇧🇹',
    aliases: ['Bhutan', 'Bhoutan']
  },
  {
    code: 'MM',
    cca3: 'MMR',
    name: 'Myanmar',
    frenchName: 'Birmanie (Myanmar)',
    continent: 'Asie',
    flag: '🇲🇲',
    aliases: ['Myanmar', 'Burma', 'Birmanie']
  },
  {
    code: 'BN',
    cca3: 'BRN',
    name: 'Brunei',
    frenchName: 'Brunéi',
    continent: 'Asie',
    flag: '🇧🇳',
    aliases: ['Brunei', 'Brunei Darussalam', 'Brunéi']
  },
  {
    code: 'KH',
    cca3: 'KHM',
    name: 'Cambodia',
    frenchName: 'Cambodge',
    continent: 'Asie',
    flag: '🇰🇭',
    aliases: ['Cambodia', 'Cambodge', 'Kampuchea']
  },
  {
    code: 'CN',
    cca3: 'CHN',
    name: 'China',
    frenchName: 'Chine',
    continent: 'Asie',
    flag: '🇨🇳',
    aliases: ['China', 'Chine', "People's Republic of China", 'Hong Kong', 'Macau', 'Macao', 'Tibet']
  },
  {
    code: 'TW',
    cca3: 'TWN',
    name: 'Taiwan',
    frenchName: 'Taïwan',
    continent: 'Asie',
    flag: '🇹🇼',
    aliases: ['Taiwan', 'Taïwan', 'Republic of China', 'Chinese Taipei']
  },
  {
    code: 'KP',
    cca3: 'PRK',
    name: 'North Korea',
    frenchName: 'Corée du Nord',
    continent: 'Asie',
    flag: '🇰🇵',
    aliases: ['North Korea', 'Democratic People\'s Republic of Korea', 'Corée du Nord', 'DPRK']
  },
  {
    code: 'KR',
    cca3: 'KOR',
    name: 'South Korea',
    frenchName: 'Corée du Sud',
    continent: 'Asie',
    flag: '🇰🇷',
    aliases: ['South Korea', 'Republic of Korea', 'Corée du Sud', 'Korea']
  },
  {
    code: 'AE',
    cca3: 'ARE',
    name: 'United Arab Emirates',
    frenchName: 'Émirats Arabes Unis',
    continent: 'Asie',
    flag: '🇦🇪',
    aliases: ['United Arab Emirates', 'UAE', 'Emirats Arabes Unis', 'Émirats Arabes Unis', 'Dubai', 'Abu Dhabi']
  },
  {
    code: 'GE',
    cca3: 'GEO',
    name: 'Georgia',
    frenchName: 'Géorgie',
    continent: 'Asie',
    flag: '🇬🇪',
    aliases: ['Georgia', 'Géorgie']
  },
  {
    code: 'IN',
    cca3: 'IND',
    name: 'India',
    frenchName: 'Inde',
    continent: 'Asie',
    flag: '🇮🇳',
    aliases: ['India', 'Inde', 'Bollywood']
  },
  {
    code: 'ID',
    cca3: 'IDN',
    name: 'Indonesia',
    frenchName: 'Indonésie',
    continent: 'Asie',
    flag: '🇮🇩',
    aliases: ['Indonesia', 'Indonésie']
  },
  {
    code: 'IQ',
    cca3: 'IRQ',
    name: 'Iraq',
    frenchName: 'Irak',
    continent: 'Asie',
    flag: '🇮🇶',
    aliases: ['Iraq', 'Irak']
  },
  {
    code: 'IR',
    cca3: 'IRN',
    name: 'Iran',
    frenchName: 'Iran',
    continent: 'Asie',
    flag: '🇮🇷',
    aliases: ['Iran', 'Islamic Republic of Iran', 'Persia', 'Perse']
  },
  {
    code: 'IL',
    cca3: 'ISR',
    name: 'Israel',
    frenchName: 'Israël',
    continent: 'Asie',
    flag: '🇮🇱',
    aliases: ['Israel', 'Israël']
  },
  {
    code: 'JP',
    cca3: 'JPN',
    name: 'Japan',
    frenchName: 'Japon',
    continent: 'Asie',
    flag: '🇯🇵',
    aliases: ['Japan', 'Japon', 'Nippon']
  },
  {
    code: 'JO',
    cca3: 'JOR',
    name: 'Jordan',
    frenchName: 'Jordanie',
    continent: 'Asie',
    flag: '🇯🇴',
    aliases: ['Jordan', 'Jordanie']
  },
  {
    code: 'KZ',
    cca3: 'KAZ',
    name: 'Kazakhstan',
    frenchName: 'Kazakhstan',
    continent: 'Asie',
    flag: '🇰🇿',
    aliases: ['Kazakhstan', 'Kazakstan']
  },
  {
    code: 'KG',
    cca3: 'KGZ',
    name: 'Kyrgyzstan',
    frenchName: 'Kirghizistan',
    continent: 'Asie',
    flag: '🇰🇬',
    aliases: ['Kyrgyzstan', 'Kirghizistan', 'Kirghizia']
  },
  {
    code: 'KW',
    cca3: 'KWT',
    name: 'Kuwait',
    frenchName: 'Koweït',
    continent: 'Asie',
    flag: '🇰🇼',
    aliases: ['Kuwait', 'Koweït', 'Koweit']
  },
  {
    code: 'LA',
    cca3: 'LAO',
    name: 'Laos',
    frenchName: 'Laos',
    continent: 'Asie',
    flag: '🇱🇦',
    aliases: ['Laos', 'Lao People\'s Democratic Republic']
  },
  {
    code: 'LB',
    cca3: 'LBN',
    name: 'Lebanon',
    frenchName: 'Liban',
    continent: 'Asie',
    flag: '🇱🇧',
    aliases: ['Lebanon', 'Liban']
  },
  {
    code: 'MY',
    cca3: 'MYS',
    name: 'Malaysia',
    frenchName: 'Malaisie',
    continent: 'Asie',
    flag: '🇲🇾',
    aliases: ['Malaysia', 'Malaisie']
  },
  {
    code: 'MV',
    cca3: 'MDV',
    name: 'Maldives',
    frenchName: 'Maldives',
    continent: 'Asie',
    flag: '🇲🇻',
    aliases: ['Maldives']
  },
  {
    code: 'MN',
    cca3: 'MNG',
    name: 'Mongolia',
    frenchName: 'Mongolie',
    continent: 'Asie',
    flag: '🇲🇳',
    aliases: ['Mongolia', 'Mongolie']
  },
  {
    code: 'NP',
    cca3: 'NPL',
    name: 'Nepal',
    frenchName: 'Népal',
    continent: 'Asie',
    flag: '🇳🇵',
    aliases: ['Nepal', 'Népal']
  },
  {
    code: 'OM',
    cca3: 'OMN',
    name: 'Oman',
    frenchName: 'Oman',
    continent: 'Asie',
    flag: '🇴🇲',
    aliases: ['Oman']
  },
  {
    code: 'UZ',
    cca3: 'UZB',
    name: 'Uzbekistan',
    frenchName: 'Ouzbékistan',
    continent: 'Asie',
    flag: '🇺🇿',
    aliases: ['Uzbekistan', 'Ouzbékistan']
  },
  {
    code: 'PK',
    cca3: 'PAK',
    name: 'Pakistan',
    frenchName: 'Pakistan',
    continent: 'Asie',
    flag: '🇵🇰',
    aliases: ['Pakistan']
  },
  {
    code: 'PS',
    cca3: 'PSE',
    name: 'Palestine',
    frenchName: 'Palestine',
    continent: 'Asie',
    flag: '🇵🇸',
    aliases: ['Palestine', 'State of Palestine', 'Palestinian Territory', 'Gaza', 'West Bank']
  },
  {
    code: 'PH',
    cca3: 'PHL',
    name: 'Philippines',
    frenchName: 'Philippines',
    continent: 'Asie',
    flag: '🇵🇭',
    aliases: ['Philippines', 'The Philippines']
  },
  {
    code: 'QA',
    cca3: 'QAT',
    name: 'Qatar',
    frenchName: 'Qatar',
    continent: 'Asie',
    flag: '🇶🇦',
    aliases: ['Qatar']
  },
  {
    code: 'SG',
    cca3: 'SGP',
    name: 'Singapore',
    frenchName: 'Singapour',
    continent: 'Asie',
    flag: '🇸🇬',
    aliases: ['Singapore', 'Singapour']
  },
  {
    code: 'LK',
    cca3: 'LKA',
    name: 'Sri Lanka',
    frenchName: 'Sri Lanka',
    continent: 'Asie',
    flag: '🇱🇰',
    aliases: ['Sri Lanka', 'Ceylon']
  },
  {
    code: 'SY',
    cca3: 'SYR',
    name: 'Syria',
    frenchName: 'Syrie',
    continent: 'Asie',
    flag: '🇸🇾',
    aliases: ['Syria', 'Syrian Arab Republic', 'Syrie']
  },
  {
    code: 'TJ',
    cca3: 'TJK',
    name: 'Tajikistan',
    frenchName: 'Tadjikistan',
    continent: 'Asie',
    flag: '🇹🇯',
    aliases: ['Tajikistan', 'Tadjikistan']
  },
  {
    code: 'TH',
    cca3: 'THA',
    name: 'Thailand',
    frenchName: 'Thaïlande',
    continent: 'Asie',
    flag: '🇹🇭',
    aliases: ['Thailand', 'Thaïlande', 'Siam']
  },
  {
    code: 'TL',
    cca3: 'TLS',
    name: 'Timor-Leste',
    frenchName: 'Timor oriental',
    continent: 'Asie',
    flag: '🇹🇱',
    aliases: ['Timor-Leste', 'East Timor', 'Timor oriental']
  },
  {
    code: 'TR',
    cca3: 'TUR',
    name: 'Turkey',
    frenchName: 'Turquie',
    continent: 'Asie',
    flag: '🇹🇷',
    aliases: ['Turkey', 'Türkiye', 'Turquie', 'Ottoman Empire']
  },
  {
    code: 'TM',
    cca3: 'TKM',
    name: 'Turkmenistan',
    frenchName: 'Turkménistan',
    continent: 'Asie',
    flag: '🇹🇲',
    aliases: ['Turkmenistan', 'Turkménistan']
  },
  {
    code: 'VN',
    cca3: 'VNM',
    name: 'Vietnam',
    frenchName: 'Viêt Nam',
    continent: 'Asie',
    flag: '🇻🇳',
    aliases: ['Vietnam', 'Viet Nam', 'Viêt Nam', 'North Vietnam', 'South Vietnam']
  },
  {
    code: 'YE',
    cca3: 'YEM',
    name: 'Yemen',
    frenchName: 'Yémen',
    continent: 'Asie',
    flag: '🇾🇪',
    aliases: ['Yemen', 'Yémen']
  },

  // ================= AFRIQUE =================
  {
    code: 'ZA',
    cca3: 'ZAF',
    name: 'South Africa',
    frenchName: 'Afrique du Sud',
    continent: 'Afrique',
    flag: '🇿🇦',
    aliases: ['South Africa', 'Afrique du Sud']
  },
  {
    code: 'DZ',
    cca3: 'DZA',
    name: 'Algeria',
    frenchName: 'Algérie',
    continent: 'Afrique',
    flag: '🇩🇿',
    aliases: ['Algeria', 'Algérie']
  },
  {
    code: 'AO',
    cca3: 'AGO',
    name: 'Angola',
    frenchName: 'Angola',
    continent: 'Afrique',
    flag: '🇦🇴',
    aliases: ['Angola']
  },
  {
    code: 'BJ',
    cca3: 'BEN',
    name: 'Benin',
    frenchName: 'Bénin',
    continent: 'Afrique',
    flag: '🇧🇯',
    aliases: ['Benin', 'Bénin', 'Dahomey']
  },
  {
    code: 'BW',
    cca3: 'BWA',
    name: 'Botswana',
    frenchName: 'Botswana',
    continent: 'Afrique',
    flag: '🇧🇼',
    aliases: ['Botswana']
  },
  {
    code: 'BF',
    cca3: 'BFA',
    name: 'Burkina Faso',
    frenchName: 'Burkina Faso',
    continent: 'Afrique',
    flag: '🇧🇫',
    aliases: ['Burkina Faso', 'Upper Volta', 'Haute-Volta']
  },
  {
    code: 'BI',
    cca3: 'BDI',
    name: 'Burundi',
    frenchName: 'Burundi',
    continent: 'Afrique',
    flag: '🇧🇮',
    aliases: ['Burundi']
  },
  {
    code: 'CM',
    cca3: 'CMR',
    name: 'Cameroon',
    frenchName: 'Cameroun',
    continent: 'Afrique',
    flag: '🇨🇲',
    aliases: ['Cameroon', 'Cameroun']
  },
  {
    code: 'CV',
    cca3: 'CPV',
    name: 'Cape Verde',
    frenchName: 'Cap-Vert',
    continent: 'Afrique',
    flag: '🇨🇻',
    aliases: ['Cape Verde', 'Cabo Verde', 'Cap-Vert']
  },
  {
    code: 'CF',
    cca3: 'CAF',
    name: 'Central African Republic',
    frenchName: 'Centrafrique',
    continent: 'Afrique',
    flag: '🇨🇫',
    aliases: ['Central African Republic', 'Centrafrique', 'République centrafricaine']
  },
  {
    code: 'KM',
    cca3: 'COM',
    name: 'Comoros',
    frenchName: 'Comores',
    continent: 'Afrique',
    flag: '🇰🇲',
    aliases: ['Comoros', 'Comores']
  },
  {
    code: 'CG',
    cca3: 'COG',
    name: 'Republic of the Congo',
    frenchName: 'Congo-Brazzaville',
    continent: 'Afrique',
    flag: '🇨🇬',
    aliases: ['Republic of the Congo', 'Congo', 'Congo-Brazzaville', 'Congo (Brazzaville)']
  },
  {
    code: 'CD',
    cca3: 'COD',
    name: 'DR Congo',
    frenchName: 'RD Congo',
    continent: 'Afrique',
    flag: '🇨🇩',
    aliases: ['Democratic Republic of the Congo', 'DR Congo', 'DRC', 'RD Congo', 'Congo (Kinshasa)', 'Zaire']
  },
  {
    code: 'CI',
    cca3: 'CIV',
    name: 'Ivory Coast',
    frenchName: 'Côte d\'Ivoire',
    continent: 'Afrique',
    flag: '🇨🇮',
    aliases: ['Ivory Coast', 'Cote d\'Ivoire', 'Côte d\'Ivoire']
  },
  {
    code: 'DJ',
    cca3: 'DJI',
    name: 'Djibouti',
    frenchName: 'Djibouti',
    continent: 'Afrique',
    flag: '🇩🇯',
    aliases: ['Djibouti']
  },
  {
    code: 'EG',
    cca3: 'EGY',
    name: 'Egypt',
    frenchName: 'Égypte',
    continent: 'Afrique',
    flag: '🇪🇬',
    aliases: ['Egypt', 'Égypte', 'Egypte']
  },
  {
    code: 'ER',
    cca3: 'ERI',
    name: 'Eritrea',
    frenchName: 'Érythrée',
    continent: 'Afrique',
    flag: '🇪🇷',
    aliases: ['Eritrea', 'Érythrée', 'Erythree']
  },
  {
    code: 'SZ',
    cca3: 'SWZ',
    name: 'Eswatini',
    frenchName: 'Eswatini',
    continent: 'Afrique',
    flag: '🇸🇿',
    aliases: ['Eswatini', 'Swaziland']
  },
  {
    code: 'ET',
    cca3: 'ETH',
    name: 'Ethiopia',
    frenchName: 'Éthiopie',
    continent: 'Afrique',
    flag: '🇪🇹',
    aliases: ['Ethiopia', 'Éthiopie', 'Ethiopie', 'Abyssinia']
  },
  {
    code: 'GA',
    cca3: 'GAB',
    name: 'Gabon',
    frenchName: 'Gabon',
    continent: 'Afrique',
    flag: '🇬🇦',
    aliases: ['Gabon']
  },
  {
    code: 'GM',
    cca3: 'GMB',
    name: 'Gambia',
    frenchName: 'Gambie',
    continent: 'Afrique',
    flag: '🇬🇲',
    aliases: ['Gambia', 'The Gambia', 'Gambie']
  },
  {
    code: 'GH',
    cca3: 'GHA',
    name: 'Ghana',
    frenchName: 'Ghana',
    continent: 'Afrique',
    flag: '🇬🇭',
    aliases: ['Ghana', 'Gold Coast']
  },
  {
    code: 'GN',
    cca3: 'GIN',
    name: 'Guinea',
    frenchName: 'Guinée',
    continent: 'Afrique',
    flag: '🇬🇳',
    aliases: ['Guinea', 'Guinée', 'Guinee']
  },
  {
    code: 'GW',
    cca3: 'GNB',
    name: 'Guinea-Bissau',
    frenchName: 'Guinée-Bissau',
    continent: 'Afrique',
    flag: '🇬🇼',
    aliases: ['Guinea-Bissau', 'Guinée-Bissau', 'Guinee-Bissau']
  },
  {
    code: 'GQ',
    cca3: 'GNQ',
    name: 'Equatorial Guinea',
    frenchName: 'Guinée équatoriale',
    continent: 'Afrique',
    flag: '🇬🇶',
    aliases: ['Equatorial Guinea', 'Guinée équatoriale', 'Guinee equatoriale']
  },
  {
    code: 'KE',
    cca3: 'KEN',
    name: 'Kenya',
    frenchName: 'Kenya',
    continent: 'Afrique',
    flag: '🇰🇪',
    aliases: ['Kenya']
  },
  {
    code: 'LS',
    cca3: 'LSO',
    name: 'Lesotho',
    frenchName: 'Lesotho',
    continent: 'Afrique',
    flag: '🇱🇸',
    aliases: ['Lesotho']
  },
  {
    code: 'LR',
    cca3: 'LBR',
    name: 'Liberia',
    frenchName: 'Libéria',
    continent: 'Afrique',
    flag: '🇱🇷',
    aliases: ['Liberia', 'Libéria']
  },
  {
    code: 'LY',
    cca3: 'LBY',
    name: 'Libya',
    frenchName: 'Libye',
    continent: 'Afrique',
    flag: '🇱🇾',
    aliases: ['Libya', 'Libye']
  },
  {
    code: 'MG',
    cca3: 'MDG',
    name: 'Madagascar',
    frenchName: 'Madagascar',
    continent: 'Afrique',
    flag: '🇲🇬',
    aliases: ['Madagascar']
  },
  {
    code: 'MW',
    cca3: 'MWI',
    name: 'Malawi',
    frenchName: 'Malawi',
    continent: 'Afrique',
    flag: '🇲🇼',
    aliases: ['Malawi', 'Nyasaland']
  },
  {
    code: 'ML',
    cca3: 'MLI',
    name: 'Mali',
    frenchName: 'Mali',
    continent: 'Afrique',
    flag: '🇲🇱',
    aliases: ['Mali']
  },
  {
    code: 'MA',
    cca3: 'MAR',
    name: 'Morocco',
    frenchName: 'Maroc',
    continent: 'Afrique',
    flag: '🇲🇦',
    aliases: ['Morocco', 'Maroc', 'Western Sahara']
  },
  {
    code: 'MU',
    cca3: 'MUS',
    name: 'Mauritius',
    frenchName: 'Maurice',
    continent: 'Afrique',
    flag: '🇲🇺',
    aliases: ['Mauritius', 'Maurice', 'Île Maurice']
  },
  {
    code: 'MR',
    cca3: 'MRT',
    name: 'Mauritania',
    frenchName: 'Mauritanie',
    continent: 'Afrique',
    flag: '🇲🇷',
    aliases: ['Mauritania', 'Mauritanie']
  },
  {
    code: 'MZ',
    cca3: 'MOZ',
    name: 'Mozambique',
    frenchName: 'Mozambique',
    continent: 'Afrique',
    flag: '🇲🇿',
    aliases: ['Mozambique']
  },
  {
    code: 'NA',
    cca3: 'NAM',
    name: 'Namibia',
    frenchName: 'Namibie',
    continent: 'Afrique',
    flag: '🇳🇦',
    aliases: ['Namibia', 'Namibie']
  },
  {
    code: 'NE',
    cca3: 'NER',
    name: 'Niger',
    frenchName: 'Niger',
    continent: 'Afrique',
    flag: '🇳🇪',
    aliases: ['Niger']
  },
  {
    code: 'NG',
    cca3: 'NGA',
    name: 'Nigeria',
    frenchName: 'Nigéria',
    continent: 'Afrique',
    flag: '🇳🇬',
    aliases: ['Nigeria', 'Nigéria', 'Nollywood']
  },
  {
    code: 'UG',
    cca3: 'UGA',
    name: 'Uganda',
    frenchName: 'Ouganda',
    continent: 'Afrique',
    flag: '🇺🇬',
    aliases: ['Uganda', 'Ouganda']
  },
  {
    code: 'RW',
    cca3: 'RWA',
    name: 'Rwanda',
    frenchName: 'Rwanda',
    continent: 'Afrique',
    flag: '🇷🇼',
    aliases: ['Rwanda']
  },
  {
    code: 'ST',
    cca3: 'STP',
    name: 'Sao Tome and Principe',
    frenchName: 'Sao Tomé-et-Principe',
    continent: 'Afrique',
    flag: '🇸🇹',
    aliases: ['Sao Tome and Principe', 'São Tomé and Príncipe', 'Sao Tomé-et-Principe']
  },
  {
    code: 'SN',
    cca3: 'SEN',
    name: 'Senegal',
    frenchName: 'Sénégal',
    continent: 'Afrique',
    flag: '🇸🇳',
    aliases: ['Senegal', 'Sénégal']
  },
  {
    code: 'SC',
    cca3: 'SYC',
    name: 'Seychelles',
    frenchName: 'Seychelles',
    continent: 'Afrique',
    flag: '🇸🇨',
    aliases: ['Seychelles']
  },
  {
    code: 'SL',
    cca3: 'SLE',
    name: 'Sierra Leone',
    frenchName: 'Sierra Leone',
    continent: 'Afrique',
    flag: '🇸🇱',
    aliases: ['Sierra Leone']
  },
  {
    code: 'SO',
    cca3: 'SOM',
    name: 'Somalia',
    frenchName: 'Somalie',
    continent: 'Afrique',
    flag: '🇸🇴',
    aliases: ['Somalia', 'Somalie']
  },
  {
    code: 'SD',
    cca3: 'SDN',
    name: 'Sudan',
    frenchName: 'Soudan',
    continent: 'Afrique',
    flag: '🇸🇩',
    aliases: ['Sudan', 'Soudan']
  },
  {
    code: 'SS',
    cca3: 'SSD',
    name: 'South Sudan',
    frenchName: 'Soudan du Sud',
    continent: 'Afrique',
    flag: '🇸🇸',
    aliases: ['South Sudan', 'Soudan du Sud']
  },
  {
    code: 'TZ',
    cca3: 'TZA',
    name: 'Tanzania',
    frenchName: 'Tanzanie',
    continent: 'Afrique',
    flag: '🇹🇿',
    aliases: ['Tanzania', 'United Republic of Tanzania', 'Tanzanie', 'Zanzibar']
  },
  {
    code: 'TD',
    cca3: 'TCD',
    name: 'Chad',
    frenchName: 'Tchad',
    continent: 'Afrique',
    flag: '🇹🇩',
    aliases: ['Chad', 'Tchad']
  },
  {
    code: 'TG',
    cca3: 'TGO',
    name: 'Togo',
    frenchName: 'Togo',
    continent: 'Afrique',
    flag: '🇹🇬',
    aliases: ['Togo']
  },
  {
    code: 'TN',
    cca3: 'TUN',
    name: 'Tunisia',
    frenchName: 'Tunisie',
    continent: 'Afrique',
    flag: '🇹🇳',
    aliases: ['Tunisia', 'Tunisie']
  },
  {
    code: 'ZM',
    cca3: 'ZMB',
    name: 'Zambia',
    frenchName: 'Zambie',
    continent: 'Afrique',
    flag: '🇿🇲',
    aliases: ['Zambia', 'Zambie', 'Northern Rhodesia']
  },
  {
    code: 'ZW',
    cca3: 'ZWE',
    name: 'Zimbabwe',
    frenchName: 'Zimbabwe',
    continent: 'Afrique',
    flag: '🇿🇼',
    aliases: ['Zimbabwe', 'Rhodesia']
  },

  // ================= AMÉRIQUES =================
  {
    code: 'US',
    cca3: 'USA',
    name: 'United States',
    frenchName: 'États-Unis',
    continent: 'Amériques',
    flag: '🇺🇸',
    aliases: ['United States', 'USA', 'United States of America', 'US', 'États-Unis', 'Etats-Unis', 'America', 'Puerto Rico']
  },
  {
    code: 'CA',
    cca3: 'CAN',
    name: 'Canada',
    frenchName: 'Canada',
    continent: 'Amériques',
    flag: '🇨🇦',
    aliases: ['Canada', 'Quebec']
  },
  {
    code: 'MX',
    cca3: 'MEX',
    name: 'Mexico',
    frenchName: 'Mexique',
    continent: 'Amériques',
    flag: '🇲🇽',
    aliases: ['Mexico', 'Mexique']
  },
  {
    code: 'AG',
    cca3: 'ATG',
    name: 'Antigua and Barbuda',
    frenchName: 'Antigua-et-Barbuda',
    continent: 'Amériques',
    flag: '🇦🇬',
    aliases: ['Antigua and Barbuda', 'Antigua-et-Barbuda']
  },
  {
    code: 'AR',
    cca3: 'ARG',
    name: 'Argentina',
    frenchName: 'Argentine',
    continent: 'Amériques',
    flag: '🇦🇷',
    aliases: ['Argentina', 'Argentine']
  },
  {
    code: 'BS',
    cca3: 'BHS',
    name: 'Bahamas',
    frenchName: 'Bahamas',
    continent: 'Amériques',
    flag: '🇧🇸',
    aliases: ['Bahamas', 'The Bahamas']
  },
  {
    code: 'BB',
    cca3: 'BRB',
    name: 'Barbados',
    frenchName: 'Barbade',
    continent: 'Amériques',
    flag: '🇧🇧',
    aliases: ['Barbados', 'Barbade']
  },
  {
    code: 'BZ',
    cca3: 'BLZ',
    name: 'Belize',
    frenchName: 'Belize',
    continent: 'Amériques',
    flag: '🇧🇿',
    aliases: ['Belize', 'British Honduras']
  },
  {
    code: 'BO',
    cca3: 'BOL',
    name: 'Bolivia',
    frenchName: 'Bolivie',
    continent: 'Amériques',
    flag: '🇧🇴',
    aliases: ['Bolivia', 'Bolivia, Plurinational State of', 'Bolivie']
  },
  {
    code: 'BR',
    cca3: 'BRA',
    name: 'Brazil',
    frenchName: 'Brésil',
    continent: 'Amériques',
    flag: '🇧🇷',
    aliases: ['Brazil', 'Brésil', 'Brasil']
  },
  {
    code: 'CL',
    cca3: 'CHL',
    name: 'Chile',
    frenchName: 'Chili',
    continent: 'Amériques',
    flag: '🇨🇱',
    aliases: ['Chile', 'Chili']
  },
  {
    code: 'CO',
    cca3: 'COL',
    name: 'Colombia',
    frenchName: 'Colombie',
    continent: 'Amériques',
    flag: '🇨🇴',
    aliases: ['Colombia', 'Colombie']
  },
  {
    code: 'CR',
    cca3: 'CRI',
    name: 'Costa Rica',
    frenchName: 'Costa Rica',
    continent: 'Amériques',
    flag: '🇨🇷',
    aliases: ['Costa Rica']
  },
  {
    code: 'CU',
    cca3: 'CUB',
    name: 'Cuba',
    frenchName: 'Cuba',
    continent: 'Amériques',
    flag: '🇨🇺',
    aliases: ['Cuba']
  },
  {
    code: 'DM',
    cca3: 'DMA',
    name: 'Dominica',
    frenchName: 'Dominique',
    continent: 'Amériques',
    flag: '🇩🇲',
    aliases: ['Dominica', 'Dominique']
  },
  {
    code: 'EC',
    cca3: 'ECU',
    name: 'Ecuador',
    frenchName: 'Équateur',
    continent: 'Amériques',
    flag: '🇪🇨',
    aliases: ['Ecuador', 'Équateur', 'Equateur']
  },
  {
    code: 'GD',
    cca3: 'GRD',
    name: 'Grenada',
    frenchName: 'Grenade',
    continent: 'Amériques',
    flag: '🇬🇩',
    aliases: ['Grenada', 'Grenade']
  },
  {
    code: 'GT',
    cca3: 'GTM',
    name: 'Guatemala',
    frenchName: 'Guatemala',
    continent: 'Amériques',
    flag: '🇬🇹',
    aliases: ['Guatemala']
  },
  {
    code: 'GY',
    cca3: 'GUY',
    name: 'Guyana',
    frenchName: 'Guyana',
    continent: 'Amériques',
    flag: '🇬🇾',
    aliases: ['Guyana', 'British Guiana']
  },
  {
    code: 'HT',
    cca3: 'HTI',
    name: 'Haiti',
    frenchName: 'Haïti',
    continent: 'Amériques',
    flag: '🇭🇹',
    aliases: ['Haiti', 'Haïti']
  },
  {
    code: 'HN',
    cca3: 'HND',
    name: 'Honduras',
    frenchName: 'Honduras',
    continent: 'Amériques',
    flag: '🇭🇳',
    aliases: ['Honduras']
  },
  {
    code: 'JM',
    cca3: 'JAM',
    name: 'Jamaica',
    frenchName: 'Jamaïque',
    continent: 'Amériques',
    flag: '🇯🇲',
    aliases: ['Jamaica', 'Jamaïque', 'Jamaique']
  },
  {
    code: 'NI',
    cca3: 'NIC',
    name: 'Nicaragua',
    frenchName: 'Nicaragua',
    continent: 'Amériques',
    flag: '🇳🇮',
    aliases: ['Nicaragua']
  },
  {
    code: 'PA',
    cca3: 'PAN',
    name: 'Panama',
    frenchName: 'Panama',
    continent: 'Amériques',
    flag: '🇵🇦',
    aliases: ['Panama']
  },
  {
    code: 'PY',
    cca3: 'PRY',
    name: 'Paraguay',
    frenchName: 'Paraguay',
    continent: 'Amériques',
    flag: '🇵🇾',
    aliases: ['Paraguay']
  },
  {
    code: 'PE',
    cca3: 'PER',
    name: 'Peru',
    frenchName: 'Pérou',
    continent: 'Amériques',
    flag: '🇵🇪',
    aliases: ['Peru', 'Pérou', 'Perou']
  },
  {
    code: 'DO',
    cca3: 'DOM',
    name: 'Dominican Republic',
    frenchName: 'République dominicaine',
    continent: 'Amériques',
    flag: '🇩🇴',
    aliases: ['Dominican Republic', 'République dominicaine', 'Republique dominicaine']
  },
  {
    code: 'KN',
    cca3: 'KNA',
    name: 'Saint Kitts and Nevis',
    frenchName: 'Saint-Christophe-et-Niévès',
    continent: 'Amériques',
    flag: '🇰🇳',
    aliases: ['Saint Kitts and Nevis', 'Saint Kitts', 'Nevis', 'Saint-Christophe-et-Niévès']
  },
  {
    code: 'LC',
    cca3: 'LCA',
    name: 'Saint Lucia',
    frenchName: 'Sainte-Lucie',
    continent: 'Amériques',
    flag: '🇱🇨',
    aliases: ['Saint Lucia', 'Sainte-Lucie']
  },
  {
    code: 'VC',
    cca3: 'VCT',
    name: 'Saint Vincent and the Grenadines',
    frenchName: 'Saint-Vincent-et-les-Grenadines',
    continent: 'Amériques',
    flag: '🇻🇨',
    aliases: ['Saint Vincent and the Grenadines', 'Saint Vincent', 'Saint-Vincent-et-les-Grenadines']
  },
  {
    code: 'SV',
    cca3: 'SLV',
    name: 'El Salvador',
    frenchName: 'Salvador',
    continent: 'Amériques',
    flag: '🇸🇻',
    aliases: ['El Salvador', 'Salvador']
  },
  {
    code: 'SR',
    cca3: 'SUR',
    name: 'Suriname',
    frenchName: 'Suriname',
    continent: 'Amériques',
    flag: '🇸🇷',
    aliases: ['Suriname', 'Dutch Guiana']
  },
  {
    code: 'TT',
    cca3: 'TTO',
    name: 'Trinidad and Tobago',
    frenchName: 'Trinité-et-Tobago',
    continent: 'Amériques',
    flag: '🇹🇹',
    aliases: ['Trinidad and Tobago', 'Trinidad', 'Tobago', 'Trinité-et-Tobago']
  },
  {
    code: 'UY',
    cca3: 'URY',
    name: 'Uruguay',
    frenchName: 'Uruguay',
    continent: 'Amériques',
    flag: '🇺🇾',
    aliases: ['Uruguay']
  },
  {
    code: 'VE',
    cca3: 'VEN',
    name: 'Venezuela',
    frenchName: 'Venezuela',
    continent: 'Amériques',
    flag: '🇻🇪',
    aliases: ['Venezuela', 'Venezuela, Bolivarian Republic of']
  },

  // ================= OCÉANIE =================
  {
    code: 'AU',
    cca3: 'AUS',
    name: 'Australia',
    frenchName: 'Australie',
    continent: 'Océanie',
    flag: '🇦🇺',
    aliases: ['Australia', 'Australie']
  },
  {
    code: 'NZ',
    cca3: 'NZL',
    name: 'New Zealand',
    frenchName: 'Nouvelle-Zélande',
    continent: 'Océanie',
    flag: '🇳🇿',
    aliases: ['New Zealand', 'Nouvelle-Zélande', 'Nouvelle Zelande', 'Aotearoa']
  },
  {
    code: 'FJ',
    cca3: 'FJI',
    name: 'Fiji',
    frenchName: 'Fidji',
    continent: 'Océanie',
    flag: '🇫🇯',
    aliases: ['Fiji', 'Fidji']
  },
  {
    code: 'KI',
    cca3: 'KIR',
    name: 'Kiribati',
    frenchName: 'Kiribati',
    continent: 'Océanie',
    flag: '🇰🇮',
    aliases: ['Kiribati']
  },
  {
    code: 'MH',
    cca3: 'MHL',
    name: 'Marshall Islands',
    frenchName: 'Îles Marshall',
    continent: 'Océanie',
    flag: '🇲🇭',
    aliases: ['Marshall Islands', 'Îles Marshall', 'Iles Marshall']
  },
  {
    code: 'FM',
    cca3: 'FSM',
    name: 'Micronesia',
    frenchName: 'Micronésie',
    continent: 'Océanie',
    flag: '🇫🇲',
    aliases: ['Micronesia', 'Federated States of Micronesia', 'Micronésie']
  },
  {
    code: 'NR',
    cca3: 'NRU',
    name: 'Nauru',
    frenchName: 'Nauru',
    continent: 'Océanie',
    flag: '🇳🇷',
    aliases: ['Nauru']
  },
  {
    code: 'PW',
    cca3: 'PLW',
    name: 'Palau',
    frenchName: 'Palaos',
    continent: 'Océanie',
    flag: '🇵🇼',
    aliases: ['Palau', 'Palaos', 'Belau']
  },
  {
    code: 'PG',
    cca3: 'PNG',
    name: 'Papua New Guinea',
    frenchName: 'Papouasie-Nouvelle-Guinée',
    continent: 'Océanie',
    flag: '🇵🇬',
    aliases: ['Papua New Guinea', 'Papouasie-Nouvelle-Guinée', 'Papouasie']
  },
  {
    code: 'SB',
    cca3: 'SLB',
    name: 'Solomon Islands',
    frenchName: 'Îles Salomon',
    continent: 'Océanie',
    flag: '🇸🇧',
    aliases: ['Solomon Islands', 'Îles Salomon', 'Iles Salomon']
  },
  {
    code: 'WS',
    cca3: 'WSM',
    name: 'Samoa',
    frenchName: 'Samoa',
    continent: 'Océanie',
    flag: '🇼🇸',
    aliases: ['Samoa', 'Western Samoa']
  },
  {
    code: 'TO',
    cca3: 'TON',
    name: 'Tonga',
    frenchName: 'Tonga',
    continent: 'Océanie',
    flag: '🇹🇴',
    aliases: ['Tonga']
  },
  {
    code: 'TV',
    cca3: 'TUV',
    name: 'Tuvalu',
    frenchName: 'Tuvalu',
    continent: 'Océanie',
    flag: '🇹🇻',
    aliases: ['Tuvalu']
  },
  {
    code: 'VU',
    cca3: 'VUT',
    name: 'Vanuatu',
    frenchName: 'Vanuatu',
    continent: 'Océanie',
    flag: '🇻🇺',
    aliases: ['Vanuatu', 'New Hebrides']
  }
];

export const CONTINENTS_ORDER: Continent[] = [
  'Europe',
  'Asie',
  'Afrique',
  'Amériques',
  'Océanie'
];

export const CONTINENT_ICONS: Record<Continent, string> = {
  'Europe': '🏰',
  'Asie': '🏯',
  'Afrique': '🦁',
  'Amériques': '🗽',
  'Océanie': '🏝️',
  'Antarctique': '❄️'
};
