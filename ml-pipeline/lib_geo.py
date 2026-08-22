"""
Shared helpers: name normalization, district->coordinate matching against
a real open dataset (Vynex/indian-cities-geodata, itself sourced from
censusindia.gov.in + Google Maps), and state capital coordinates
(public, well-known facts) used only as a fallback anchor for districts
that have no city >100k population in the geodata source.
"""
import re
import difflib
import pandas as pd

STATE_MAP = {
    'a n islands': 'andaman and nicobar islands',
    'd n haveli': 'dadra and nagar haveli and daman and diu',
    'd n haveli and daman diu': 'dadra and nagar haveli and daman and diu',
    'daman diu': 'dadra and nagar haveli and daman and diu',
    'delhi ut': 'delhi',
    'jammu kashmir': 'jammu and kashmir',
}

# Well-known renamed / alternate-spelling Indian cities. Public knowledge,
# used only to improve name matching against the geodata source (not to
# invent any new facts).
ALIASES = {
    'trivandrum': 'thiruvananthapuram',
    'thiruvallur': 'tiruvallur',
    'kushi nagar': 'kushinagar',
    'baleshwar': 'balasore',
    'bangalore': 'bengaluru',
    'bombay': 'mumbai',
    'calcutta': 'kolkata',
    'madras': 'chennai',
    'cuddapah': 'kadapa',
    'gurgaon': 'gurugram',
    'allahabad': 'prayagraj',
    'baroda': 'vadodara',
    'poona': 'pune',
}

NON_GEO_KEYWORDS = [
    'total', 'railway', 'vigilance', 'commission', 'crime branch', 'cid',
    'range', 'zone', 'ggp', ' grp', 'zz ', ' rpf', 'armed police',
    'special branch', 'gwaliactivity',
]

# Known-dangerous near-string-matches that are actually DIFFERENT districts
# (caught by manual review of the fuzzy-match output) - block them outright
# rather than risk showing a district's real crime data at a neighbouring
# district's coordinates.
FUZZY_BLOCKLIST = {
    ('west bengal', 'south 24 parganas'),  # must not fall back to "north 24 parganas"
    ('madhya pradesh', 'agar'),            # must not fall back to "sagar"
}

# Public, well-known capital-city coordinates for Indian states / UTs.
# Used ONLY as a fallback anchor (clearly flagged low precision) for real
# districts that have no city above the 100k-population threshold in the
# geodata source, so they are never silently dropped from state rollups.
STATE_CAPITAL_COORDS = {
    'andaman and nicobar islands': (11.6234, 92.7265),
    'andhra pradesh': (16.5062, 80.6480),
    'arunachal pradesh': (27.0844, 93.6053),
    'assam': (26.1445, 91.7362),
    'bihar': (25.5941, 85.1376),
    'chandigarh': (30.7333, 76.7794),
    'chhattisgarh': (21.2514, 81.6296),
    'dadra and nagar haveli and daman and diu': (20.3974, 72.8328),
    'delhi': (28.6139, 77.2090),
    'goa': (15.4909, 73.8278),
    'gujarat': (23.0225, 72.5714),
    'haryana': (30.7333, 76.7794),
    'himachal pradesh': (31.1048, 77.1734),
    'jammu and kashmir': (34.0837, 74.7973),
    'jharkhand': (23.3441, 85.3096),
    'karnataka': (12.9716, 77.5946),
    'kerala': (8.5241, 76.9366),
    'ladakh': (34.1526, 77.5771),
    'lakshadweep': (10.5667, 72.6417),
    'madhya pradesh': (23.2599, 77.4126),
    'maharashtra': (19.0760, 72.8777),
    'manipur': (24.8170, 93.9368),
    'meghalaya': (25.5788, 91.8933),
    'mizoram': (23.7307, 92.7173),
    'nagaland': (25.6751, 94.1086),
    'odisha': (20.2961, 85.8245),
    'puducherry': (11.9416, 79.8083),
    'punjab': (30.7333, 76.7794),
    'rajasthan': (26.9124, 75.7873),
    'sikkim': (27.3314, 88.6138),
    'tamil nadu': (13.0827, 80.2707),
    'telangana': (17.3850, 78.4867),
    'tripura': (23.8315, 91.2868),
    'uttar pradesh': (26.8467, 80.9462),
    'uttarakhand': (30.3165, 78.0322),
    'west bengal': (22.5726, 88.3639),
}


def norm(s):
    if pd.isna(s):
        return ''
    s = str(s).lower().strip()
    s = s.replace('&', 'and')
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    for w in [' district', ' dist', ' city', ' rural', ' urban', ' commissionerate', ' commissionarate']:
        if s.endswith(w):
            s = s[: -len(w)]
    return ALIASES.get(s.strip(), s.strip())


def is_reporting_unit(district_key):
    return any(k in district_key for k in NON_GEO_KEYWORDS)


def build_geo_lookup(geo_csv_path):
    geo = pd.read_csv(geo_csv_path)
    geo['d_key'] = geo['district'].apply(norm)
    geo['s_key'] = geo['state'].apply(norm)
    geo_best = geo.sort_values('population', ascending=False).drop_duplicates(
        subset=['s_key', 'd_key'], keep='first'
    )
    lookup = {(r.s_key, r.d_key): (r.latitude, r.longitude, r.city, r.population)
              for r in geo_best.itertuples()}
    by_state = {}
    for r in geo_best.itertuples():
        by_state.setdefault(r.s_key, []).append(r.d_key)
    return lookup, by_state


def match_district(s_key, d_key, lookup, by_state, cutoff=0.87):
    hit = lookup.get((s_key, d_key))
    if hit:
        lat, lon, city, pop = hit
        return lat, lon, city, pop, 'exact'
    if (s_key, d_key) in FUZZY_BLOCKLIST:
        return None, None, None, None, None
    cands = by_state.get(s_key, [])
    best = difflib.get_close_matches(d_key, cands, n=1, cutoff=cutoff)
    if best:
        lat, lon, city, pop = lookup[(s_key, best[0])]
        return lat, lon, city, pop, f'fuzzy:{best[0]}'
    return None, None, None, None, None
