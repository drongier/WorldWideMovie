import type { Country, Continent } from '../types';

import { INITIAL_COUNTRIES } from '../data/countriesData';

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,flags,flag,translations';

function mapRegionToContinent(region: string): Continent {
  switch (region?.toLowerCase()) {
    case 'europe':
      return 'Europe';
    case 'asia':
      return 'Asie';
    case 'africa':
      return 'Afrique';
    case 'americas':
      return 'Amériques';
    case 'oceania':
      return 'Océanie';
    case 'antarctic':
      return 'Antarctique';
    default:
      return 'Europe';
  }
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch(REST_COUNTRIES_URL);
    if (!response.ok) {
      console.warn('REST Countries API returned non-200, using local fallback.');
      return INITIAL_COUNTRIES;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return INITIAL_COUNTRIES;
    }

    // Merge data from REST Countries with our curated fallback to preserve clean French names and rich aliases
    const fallbackMap = new Map<string, Country>();
    INITIAL_COUNTRIES.forEach((c) => {
      fallbackMap.set(c.code.toUpperCase(), c);
      fallbackMap.set(c.cca3.toUpperCase(), c);
    });

    const enrichedCountries: Country[] = [];
    const seenCodes = new Set<string>();

    data.forEach((item: any) => {
      const code = item.cca2?.toUpperCase();
      if (!code || seenCodes.has(code)) return;
      seenCodes.add(code);

      const cca3 = item.cca3?.toUpperCase() || code;
      const fallback = fallbackMap.get(code) || fallbackMap.get(cca3);

      const commonName = item.name?.common || fallback?.name || code;
      const frenchName =
        fallback?.frenchName ||
        item.translations?.fra?.common ||
        item.translations?.fra?.official ||
        commonName;

      const continent = fallback?.continent || mapRegionToContinent(item.region);
      const flag = item.flag || fallback?.flag || '🏳️';
      const flagUrl = item.flags?.svg || item.flags?.png || fallback?.flagUrl;

      const aliases = new Set<string>([
        commonName,
        frenchName,
        item.name?.official,
        item.translations?.fra?.official,
        code,
        cca3,
        ...(fallback?.aliases || [])
      ].filter(Boolean) as string[]);

      enrichedCountries.push({
        code,
        cca3,
        name: commonName,
        frenchName,
        continent,
        flag,
        flagUrl,
        aliases: Array.from(aliases)
      });
    });

    // Make sure all countries from our initial list exist (in case restcountries missed any)
    INITIAL_COUNTRIES.forEach((c) => {
      if (!seenCodes.has(c.code.toUpperCase())) {
        enrichedCountries.push(c);
        seenCodes.add(c.code.toUpperCase());
      }
    });

    return enrichedCountries;
  } catch (error) {
    console.warn('Error fetching REST Countries, fallback to initial dataset:', error);
    return INITIAL_COUNTRIES;
  }
}
